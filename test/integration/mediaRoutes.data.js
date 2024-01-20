// The mocked data, expected data, and tested routes for mediaRoutes.test.js
let omdbTitleRoute = `/media/omdb/search?search=matrix`;

let omdbTitleExpected = {
  success: true,
  results: [
    {
      Title: "The Matrix",
      Year: "1999",
      imdbID: "tt0133093",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix Reloaded",
      Year: "2003",
      imdbID: "tt0234215",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BODE0MzZhZTgtYzkwYi00YmI5LThlZWYtOWRmNWE5ODk0NzMxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix Revolutions",
      Year: "2003",
      imdbID: "tt0242653",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNzNlZTZjMDctZjYwNi00NzljLWIwN2QtZWZmYmJiYzQ0MTk2XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix Resurrections",
      Year: "2021",
      imdbID: "tt10838180",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMGJkNDJlZWUtOGM1Ny00YjNkLThiM2QtY2ZjMzQxMTIxNWNmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
    },
    {
      Title: "Making 'The Matrix'",
      Year: "1999",
      imdbID: "tt0365467",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BZjJjMTg5MTEtMDkwMy00ZjUyLTg5ODYtMmNmY2ZiNGVlZTdjXkEyXkFqcGdeQXVyODA1NjQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix Revisited",
      Year: "2001",
      imdbID: "tt0295432",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMTkzNjg3NjE4N15BMl5BanBnXkFtZTgwNTc3NTAwNzE@._V1_SX300.jpg",
    },
    {
      Title: "Enter the Matrix",
      Year: "2003",
      imdbID: "tt0277828",
      Type: "game",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNWM3MDU2MWQtYjdlNC00NDBlLTkyNGMtNjdhYjdlNTdiNTFlXkEyXkFqcGdeQXVyNTEwNDY2MjU@._V1_SX300.jpg",
    },
    {
      Title: "A Glitch in the Matrix",
      Year: "2021",
      imdbID: "tt9847360",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMWRhNGY3NGQtMDAxMS00YjY2LTgzOTUtZjljZmUyYWQwMGI2XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix: Path of Neo",
      Year: "2005",
      imdbID: "tt0451118",
      Type: "game",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BZGFiNGU4MjEtODM2ZC00OTg0LThkNmEtZTBlN2FkMmFjOWYzXkEyXkFqcGdeQXVyNTEwNDY2MjU@._V1_SX300.jpg",
    },
    {
      Title: "Armitage III: Dual Matrix",
      Year: "2002",
      imdbID: "tt0303678",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BOTUwOTY3Mjg1MF5BMl5BanBnXkFtZTcwODI2MTAyMQ@@._V1_SX300.jpg",
    },
  ],
  totalResults: 139,
};

let omdbTitleParamsRoute = `/media/omdb/search?search=matrix&page=5&type=movie`;

let omdbTitleParamsExpected = {
  success: true,
  results: [
    {
      Title: "The Matrix Revolutions: Double Agent Smith",
      Year: "2004",
      imdbID: "tt5325370",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMWJlMDBhZmYtMDIxMi00Nzk5LTgwMGQtYTJjNzBlZjRlMTY2XkEyXkFqcGdeQXVyODA1NjQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix Revolutions: Crew",
      Year: "2004",
      imdbID: "tt5325428",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BZTBjZjUzYzItMTE3OC00YzYxLWJmZjMtODgwNGNjOTYyMzYzXkEyXkFqcGdeQXVyODA1NjQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix Revolutions: New Blue World",
      Year: "2004",
      imdbID: "tt5326032",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMzM1YjIwNDQtODMyMy00YzQ5LTljZmYtNjI4MDIxNzE4ZWQwXkEyXkFqcGdeQXVyODA1NjQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "Mind Over Matter: The Physicality of the Matrix Future",
      Year: "2004",
      imdbID: "tt5325366",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNzEyNjlmYjQtZWU3ZS00NWUxLWE3YWItM2I4ODU1ZTllZThmXkEyXkFqcGdeQXVyODA1NjQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "Matrix of Love",
      Year: "2008",
      imdbID: "tt4413244",
      Type: "movie",
      Poster: "N/A",
    },
    {
      Title: "Adventures in Odyssey: Escape from the Forbidden Matrix",
      Year: "2000",
      imdbID: "tt1974203",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMTQ3MDE1NzYxOV5BMl5BanBnXkFtZTgwODk0Njc0NTE@._V1_SX300.jpg",
    },
    {
      Title: "The Divine Matrix",
      Year: "2008",
      imdbID: "tt2990982",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMjA1MTEzNDU3M15BMl5BanBnXkFtZTgwNzUxODA2MDE@._V1_SX300.jpg",
    },
    {
      Title: "Bigger Questions... The Psychic Matrix",
      Year: "2008",
      imdbID: "tt2355608",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMTM5Mzk1NzE1N15BMl5BanBnXkFtZTgwOTMzNzA2MDE@._V1_SX300.jpg",
    },
    {
      Title: "The Matrix Revolutions: CG Revolution",
      Year: "2004",
      imdbID: "tt5323572",
      Type: "movie",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BYjZhYzBhOTYtYWFiZS00Yzk3LTk3MWMtOTE0MjI1ZGM4M2FiXkEyXkFqcGdeQXVyODA1NjQ0OTY@._V1_SX300.jpg",
    },
    {
      Title: "Interviews from the Set of 'The Matrix Revolutions'",
      Year: "2003",
      imdbID: "tt5700122",
      Type: "movie",
      Poster: "N/A",
    },
  ],
  totalResults: 126,
};

let omdbTitleErrorRoute = `/media/omdb/search`;

let omdbTitleErrorExpected = {
  success: false,
  message: "Failed to search OMDB",
};

let omdbIdRoute = `/media/omdb/search?search=tt0133093`;

let omdbIdExpected = {
  success: true,
  results: [
    {
      Title: "The Matrix",
      Year: "1999",
      Rated: "R",
      Released: "31 Mar 1999",
      Runtime: "136 min",
      Genre: "Action, Sci-Fi",
      Director: "Lana Wachowski, Lilly Wachowski",
      Writer: "Lilly Wachowski, Lana Wachowski",
      Actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
      Plot: "Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. As a rebel against the machines, Neo must confront the agents: super-powerful computer programs devoted to stopping Neo and the entire human rebellion.",
      Language: "English",
      Country: "United States, Australia",
      Awards: "Won 4 Oscars. 42 wins & 52 nominations total",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      Ratings: [
        { Source: "Internet Movie Database", Value: "8.7/10" },
        { Source: "Rotten Tomatoes", Value: "83%" },
        { Source: "Metacritic", Value: "73/100" },
      ],
      Metascore: "73",
      imdbRating: "8.7",
      imdbID: "tt0133093",
      Type: "movie",
      DVD: "01 Jan 2009",
      BoxOffice: "$172,076,928",
      Production: "N/A",
      Website: "N/A",
    },
  ],
  totalResults: 1,
};

let omdbIdErrorRoute = `/media/omdb/search?search=tt0133`;

let omdbIdErrorExpected = {
  success: false,
  message: "Failed to search OMDB",
};

let omdbRandomRoute = `/media/omdb/random`;

let omdbRandomAmount = 10;

let omdbRandomParamsRoute = `/media/omdb/random?amount=15`;

let omdbRandomParamsAmount = 15;

let omdbRandomErrorRoute = `/media/omdb/random?amount=-1`;

let omdbRandomErrorExpected = {
  success: false,
  message: "Failed to make a random search of OMDB",
};

module.exports = {
  omdbTitleRoute,
  omdbTitleExpected,
  omdbTitleParamsRoute,
  omdbTitleParamsExpected,
  omdbTitleErrorRoute,
  omdbTitleErrorExpected,
  omdbIdRoute,
  omdbIdExpected,
  omdbIdErrorRoute,
  omdbIdErrorExpected,
  omdbRandomRoute,
  omdbRandomAmount,
  omdbRandomParamsRoute,
  omdbRandomParamsAmount,
  omdbRandomErrorRoute,
  omdbRandomErrorExpected,
};
