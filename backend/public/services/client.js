// import feathers from '@feathersjs/client';
// import io from 'socket.io-client';

const socket = io();
const client = feathers();
client.configure(feathers.socketio(socket));
client.configure(feathers.authentication());

export default client;

export const getEnabledGames = async () => {
  return await client.service('games').find({ query: { enabled: true } });
};

export const getAllGames = async (limit, skip) => {
  return await client.service('games').find({ query: { $limit: limit, $skip: skip } });
};

export const getAllSetsForGame = async (gameId, limit, skip) => {
  return await client.service('sets').find({ query: { game_id: gameId, $limit: limit, $skip: skip } });
};

export const getProductsForGame = async (gameId, limit, skip) => {
  return await client.service('products').find({ query: { game_id: gameId, $limit: limit, $skip: skip } });
};

export const getProductsForSet = async (setId, limit, skip) => {
  return await client.service('products').find({ query: { set_id: setId, $limit: limit, $skip: skip } });
};