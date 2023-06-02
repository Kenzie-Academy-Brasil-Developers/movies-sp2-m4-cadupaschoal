import { QueryResult } from 'pg';

interface IMovie {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
}
type MovieCreate = Omit<IMovie, 'id'>;
type MovieUpdate = Partial<MovieCreate>;
type MovieResult = QueryResult<IMovie>;

export { MovieCreate, MovieResult, MovieUpdate };
