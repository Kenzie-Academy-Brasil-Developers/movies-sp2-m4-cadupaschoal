import { Request, Response, NextFunction } from 'express';
import { MovieResult } from './interfaces';
import { client } from './database';

const verifyIfExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = request.body;
  const queryString: string = 'SELECT * FROM movies;';
  const queryResultAll = await client.query(queryString);
  const allNames = queryResultAll.rows.filter((movie) => movie.name);
  if (allNames.includes(name)) {
    const error = 'Movie name already exists!';
    return response.status(409).json({ error });
  }
  const queryResult: MovieResult = await client.query(
    'SELECT * FROM movies WHERE name = $1',
    [name]
  );
  if (queryResult.rows.length !== 0) {
    const error = 'Movie name already exists!';
    return response.status(409).json({ error });
  }

  next();
};

const verifyIfIdExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const method = request.method;
  const { id } = request.params;
  const queryResult: MovieResult = await client.query(
    'SELECT * FROM movies WHERE id = $1',
    [id]
  );

  if (queryResult.rows.length === 0) {
    const error = 'Movie not found!';
    return response.status(404).json({ error });
  }
  if (method === 'GET') {
    response.locals = {
      ...response.locals,
      searchMovie: queryResult.rows[0],
    };
    next();
  }
  if (method === 'PATCH' || method === 'DELETE') {
    response.locals = {
      ...response.locals,
      requestId: id,
    };
    next();
  }
};

export { verifyIfExists, verifyIfIdExists };
