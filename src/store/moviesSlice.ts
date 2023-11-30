import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMovies, fetchMovie } from "@utils/requests";
import type { Movie } from "types";
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
}

export type MoviesSearchState = MoviesState & FilterState;

const initialState: MoviesSearchState = {
  movies: [],
  currentMovie: null,
  searchTerm: "Cartoon",
  year: undefined,
  type: undefined,
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
  }: {
    searchTerm: string;
    page: number;
    year?: string;
    type?: string;
  }) => {
    const response = await fetchMovies(searchTerm, page, year, type);
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

    
    sortMovies: (state, action) => {
      const sortedMovies = [...state.movies];
      console.log(sortedMovies);
      
      sortedMovies.sort((a, b) => {
        const aValue = a[action.payload.criteria];
        const bValue = b[action.payload.criteria];

        console.log(a.imdbVo);
        
    
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Compare strings

          return action.payload.order === 'ascending'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          // Compare numbers
          return action.payload.order === 'ascending'
            ? aValue - bValue
            : bValue - aValue;
        } else {
          return 0;
        }
      });

      state.movies = sortedMovies;
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
