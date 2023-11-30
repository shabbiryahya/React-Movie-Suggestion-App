import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMovies, fetchMovie } from "@utils/requests";
import type { Movie } from "types";
import { PayloadAction } from '@reduxjs/toolkit';
export interface MoviesState {
  movies: Movie[];
  currentMovie: Movie | null;
  searchTerm?: string | undefined;
  status: "idle" | "loading" | "failed";
  error: string | null;
  totalResults: number;
}

export interface FilterState {
  year?: string;
  type?: string;
  sort?: string; 
}

export type MoviesSearchState = MoviesState & FilterState;

const initialState: MoviesSearchState = {
  movies: [],
  currentMovie: null,
  searchTerm: "Cartoon",
  year: undefined,
  type: undefined,
  sort: undefined, 
  status: "idle",
  error: null,
  totalResults: 0,
};

export const fetchMoviesAsync = createAsyncThunk(
  "movies/fetchMovies",
  async ({
    searchTerm,
    page,
    year,
    type,
    sort,
  }: {
    searchTerm: string;
    page: number;
    year?: string;
    type?: string;
    sort?: string; 
  }) => {
    const response = await fetchMovies(searchTerm, page, year, type,sort);
    return response;
  }
);

export const fetchMovieAsync = createAsyncThunk(
  "movies/fetchMovie",
  async (imdbID: string) => {
    const response = await fetchMovie(imdbID);
    return response;
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    updateSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    updateFilter: (state, action) => {
      state.year = action.payload.year;
      state.type = action.payload.type;
    },
    sortMovies: (state, action: PayloadAction<{field: string, order: string}>) => {
      const sortedMovies = [...state.movies]; // create a copy of the movies array
      if (action.payload.field === 'Year') {
        sortedMovies.sort((a, b) => (a.Year && b.Year) ? (a.Year - b.Year) * (action.payload.order === 'asc' ? 1 : -1) : 0);
      } else if (action.payload.field === 'Ratings') {
        sortedMovies.sort((a, b) => {
          const ratingA = a.Ratings ? parseFloat(a.Ratings[0].Value) : 0;
          const ratingB = b.Ratings ? parseFloat(b.Ratings[0].Value) : 0;
          return (ratingA - ratingB) * (action.payload.order === 'asc' ? 1 : -1);
        });
      }
      state.movies = sortedMovies; // set the sorted array as the new state
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMoviesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.movies = action.payload.Search;
        state.totalResults = action.payload.totalResults;
      })
      .addCase(fetchMoviesAsync.rejected, (state, action) => {
        state.status = "failed";
        action.error.message
          ? (state.error = action.error.message)
          : (state.error = "Something went wrong");
      })
      .addCase(fetchMovieAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovieAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieAsync.rejected, (state, action) => {
        state.status = "failed";
        action.error.message
          ? (state.error = action.error.message)
          : (state.error = "Something went wrong");
      });
  },
});

export const { updateSearchTerm, updateFilter } = moviesSlice.actions;
export default moviesSlice.reducer;
export const { sortMovies } = moviesSlice.actions;