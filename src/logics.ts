import { Response, Request } from 'express';
import { MovieCreate, MovieResult, MovieUpdate } from './interfaces';
import format from 'pg-format';
import { client } from './database';
const create = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const payload: MovieCreate = request.body;

  const queryFormat: string = format(
    'INSERT INTO movies (%I) VALUES (%L) RETURNING *;',
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: MovieResult = await client.query(queryFormat);
  return response.status(201).json(queryResult.rows[0]);
};

const retrieve = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const search = request.query;
  if (Object.keys(search).length === 0) {
    const queryString: string = 'SELECT * FROM movies;';
    const queryResult: MovieResult = await client.query(queryString);

    return response.status(200).json(queryResult.rows);
  }
  const queryFormat: string = format(
    'SELECT * FROM movies WHERE (%I) = (%L);',
    Object.keys(search),
    Object.values(search)
  );
  const queryResultParam: MovieResult = await client.query(queryFormat);
  if (queryResultParam.rowCount > 0) {
    return response.status(200).json(queryResultParam.rows);
  }

  const queryString: string = 'SELECT * FROM movies;';
  const queryResult: MovieResult = await client.query(queryString);

  return response.status(200).json(queryResult.rows);
};

const read = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const movie = response.locals.searchMovie;
  return response.status(200).json(movie);
};

const update = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const body: MovieUpdate = request.body;
  const id: number = response.locals.requestId;

  const queryFormat: string = format(
    'UPDATE movies SET (%I) = ROW (%L) WHERE id = $1 RETURNING *;',
    Object.keys(body),
    Object.values(body)
  );

  const queryResult: MovieResult = await client.query(queryFormat, [id]);

  return response.status(201).json(queryResult.rows[0]);
};

const erase = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = response.locals.requestId;
  client.query('DELETE FROM movies WHERE id = $1', [id]);
  return response.status(204).json();
};
export { create, retrieve, read, update, erase };
