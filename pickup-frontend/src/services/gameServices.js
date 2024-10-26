import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  GeoPoint,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const GAMES_COLLECTION = 'games';
const GAME_PLAYERS_COLLECTION = 'game_players';
const USER_GAMES_COLLECTION = 'user_games';

export const gameService = {
  // Create a new game
  async createGame(gameData) {
    try {
      // Add timestamps
      const gameWithTimestamps = {
        ...gameData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        currentPlayers: 1 // Host is first player
      };

      // Convert location to GeoPoint if coordinates are provided
      if (gameData.location?.latitude && gameData.location?.longitude) {
        gameWithTimestamps.location.coordinates = new GeoPoint(
          gameData.location.latitude,
          gameData.location.longitude
        );
      }

      // Create game document
      const gameRef = await addDoc(collection(db, GAMES_COLLECTION), gameWithTimestamps);
      
      // Add host to game_players subcollection
      await addDoc(collection(db, GAMES_COLLECTION, gameRef.id, GAME_PLAYERS_COLLECTION), {
        userId: gameData.hostId,
        status: 'confirmed',
        role: 'host',
        joinedAt: serverTimestamp()
      });

      // Add to user_games collection for quick queries
      await addDoc(collection(db, USER_GAMES_COLLECTION), {
        userId: gameData.hostId,
        gameId: gameRef.id,
        role: 'host',
        status: 'confirmed',
        startTime: gameData.schedule.startTime
      });

      return gameRef.id;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  // Get game by ID
  async getGame(gameId) {
    try {
      const gameDoc = await getDoc(doc(db, GAMES_COLLECTION, gameId));
      if (!gameDoc.exists()) {
        throw new Error('Game not found');
      }
      return { id: gameDoc.id, ...gameDoc.data() };
    } catch (error) {
      console.error('Error getting game:', error);
      throw error;
    }
  },

  // Get games for swiping (with filters)
  async getGamesForSwiping(filters, lastGame = null) {
    try {
      let q = collection(db, GAMES_COLLECTION);
      
      // Base query conditions
      const conditions = [
        where('status', '==', 'active'),
        where('schedule.startTime', '>', new Date()),
        orderBy('schedule.startTime', 'asc')
      ];

      // Add filters
      if (filters.sport) {
        conditions.push(where('sport', '==', filters.sport));
      }
      if (filters.skillLevel) {
        conditions.push(where('skillLevel', '==', filters.skillLevel));
      }
      if (filters.hostRating) {
        conditions.push(where('hostRating', '>=', filters.hostRating));
      }

      // Build query with conditions
      q = query(q, ...conditions);

      // Add pagination
      if (lastGame) {
        q = query(q, startAfter(lastGame), limit(10));
      } else {
        q = query(q, limit(10));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting games for swiping:', error);
      throw error;
    }
  },

  // Join a game
  async joinGame(gameId, userId, autoJoin = false) {
    try {
      const gameRef = doc(db, GAMES_COLLECTION, gameId);
      const gameDoc = await getDoc(gameRef);
      const gameData = gameDoc.data();

      // Check if game is full
      if (gameData.currentPlayers >= gameData.maxPlayers) {
        throw new Error('Game is full');
      }

      // Add player to game_players subcollection
      await addDoc(collection(db, GAMES_COLLECTION, gameId, GAME_PLAYERS_COLLECTION), {
        userId,
        status: autoJoin ? 'confirmed' : 'pending',
        role: 'player',
        joinedAt: serverTimestamp()
      });

      // Add to user_games collection
      await addDoc(collection(db, USER_GAMES_COLLECTION), {
        userId,
        gameId,
        role: 'player',
        status: autoJoin ? 'confirmed' : 'pending',
        startTime: gameData.schedule.startTime
      });

      // Update current players count if auto-join
      if (autoJoin) {
        await updateDoc(gameRef, {
          currentPlayers: gameData.currentPlayers + 1,
          updatedAt: serverTimestamp()
        });
      }

      return true;
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  },

  // Get user's games
  async getUserGames(userId) {
    try {
      const q = query(
        collection(db, USER_GAMES_COLLECTION),
        where('userId', '==', userId),
        where('startTime', '>', new Date()),
        orderBy('startTime', 'asc')
      );

      const snapshot = await getDocs(q);
      const userGames = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get full game details for each game
      const gamePromises = userGames.map(async (userGame) => {
        const gameDoc = await getDoc(doc(db, GAMES_COLLECTION, userGame.gameId));
        return {
          ...userGame,
          gameDetails: { id: gameDoc.id, ...gameDoc.data() }
        };
      });

      return Promise.all(gamePromises);
    } catch (error) {
      console.error('Error getting user games:', error);
      throw error;
    }
  }
};