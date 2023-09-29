// logoutService.test.js
const logoutService = require('../services/wawUserManagement/logoutService'); // Adjust the path
//const logger = require('../path-to-logger'); // Adjust the path
//const analytics = require('../path-to-analytics'); // Adjust the path

// Mock req and res objects
const mockReq = {
    user: { id: '123' },
    logout: jest.fn(),
    session: { loginTime: new Date().toISOString() }
};
const mockRes = {
    clearCookie: jest.fn(),
    redirect: jest.fn()
};

describe('logoutService', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('performLogout should logout the user and clear cookie', () => {
        logoutService.performLogout(mockReq, mockRes);

        expect(mockReq.logout).toHaveBeenCalled();
        expect(mockRes.clearCookie).toHaveBeenCalledWith('oauth_token');
        expect(mockRes.redirect).toHaveBeenCalledWith('/');
    });
    
    test('performLogout should log and record analytics', () => {
        // Mock logger and analytics functions
        jest.spyOn(logger, 'log');
        jest.spyOn(analytics, 'recordSessionDuration');
        
        logoutService.performLogout(mockReq, mockRes);

        expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('User 123 logged out at'));
        expect(analytics.recordSessionDuration).toHaveBeenCalledWith('123', expect.any(Number));
    });
});
