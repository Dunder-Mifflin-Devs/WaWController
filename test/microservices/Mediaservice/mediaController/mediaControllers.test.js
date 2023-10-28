const omdb = require('../../../../src/microServices/MediaService/mediaControllers/mediaControllers');
jest.mock('../../../../src/microServices/MediaService/utils/randomWords.js')
const randomWords = require('../../../../src/microServices/MediaService/utils/randomWords');

const fetchResults = jest.fn();

describe('searchOMDB', () => {
  it('should return a successful response for valid search parameters', async () => {
    const req = { query: { search: 'Matrix', type: 'movie', page: 1 } };
    const res = { json: jest.fn() };

    fetchResults.mockResolvedValue({
      success: true,
      Search: [1, 2, 3],
      totalResults: 3,
    });

    const response = await omdb.searchOMDB(req, res);
console.log(response)
    // expect(response.success).toBe(true);
    expect(response.results).toEqual([1, 2, 3]);
    expect(response.totalResults).toBe(3);

    expect(fetchResults).toHaveBeenCalledWith({
      search: 'Matrix',
      type: 'movie',
      page: 1,
    });
  });


//   it('should handle a search error', async () => {
//     const req = { query: { search: 'NonexistentMovie', type: 'movie', page: 1 } };
//     const res = { json: jest.fn() };

//     // Mock the native fetch function for an error scenario
//     const errorResponse = {
//       Response: 'False',
//       // Mock an error message here
//     };
//     global.fetch = jest.fn().mockResolvedValueOnce({
//       json: jest.fn().mockResolvedValueOnce(errorResponse),
//     });

//     await omdb.searchOMDB(req, res);

//     expect(res.json).toHaveBeenCalledWith(/* your expected response */);

//     // Restore the original fetch function
//     global.fetch.mockRestore();
//   });

//   // Add more test cases to cover various scenarios
// });

// describe('randomOMDB', () => {
//   it('should generate random movies successfully', async () => {
//     const req = { query: { type: 'movie', amount: 10 } };
//     const res = { json: jest.fn() };

//     // Mock the native fetch function for random movie generation
//     const randomMovieResponse = {
//       Response: 'True',
//       Search: [],
//     };
//     global.fetch = jest.fn().mockResolvedValueOnce({
//       json: jest.fn().mockResolvedValueOnce(randomMovieResponse),
//     });

//     await omdb.randomOMDB(req, res);

//     expect(res.json).toHaveBeenCalledWith(/* your expected response */);

//     // Restore the original fetch function
//     global.fetch.mockRestore();
//   });

//   it('should handle a random search error', async () => {
//     const req = { query: { type: 'movie', amount: 10 } };
//     const res = { json: jest.fn() };

//     // Mock the native fetch function for a random search error
//     const errorResponse = {
//       Response: 'False',
//       // Mock an error message here
//     };
//     global.fetch = jest.fn().mockResolvedValueOnce({
//       json: jest.fn().mockResolvedValueOnce(errorResponse),
//     });

//     await omdb.randomOMDB(req, res);

//     expect(res.json).toHaveBeenCalledWith(/* your expected response */);

//     // Restore the original fetch function
//     global.fetch.mockRestore();
//   });

  // Add more test cases to cover various scenarios
});