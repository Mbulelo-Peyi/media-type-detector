import { getBlobAndDetectCategory, urlToBlob } from '../index';

describe('urlToBlob', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it('fetches and returns a blob', async () => {
        const mockBlob = new Blob(['test data'], { type: 'text/plain' });

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            blob: jest.fn().mockResolvedValueOnce(mockBlob),
            headers: { get: () => 'text/plain' },
        });

        const result = await urlToBlob('https://example.com/file.txt');
        expect(result).toEqual(mockBlob);
    });

    it('throws an error if fetch fails', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        });

        await expect(urlToBlob('https://bad.url')).rejects.toThrow('Failed to fetch: 404 Not Found');
    });

    it('throws an error if content-type is missing', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            blob: jest.fn(),
            headers: { get: () => null },
        });

        await expect(urlToBlob('https://example.com')).rejects.toThrow('Missing Content-Type header');
    });
});

describe('getBlobAndDetectCategory', () => {
    const originalFetch = global.fetch;
    const mockBlob = new Blob(['dummy'], { type: 'image/png' });

    afterEach(() => {
        global.fetch = originalFetch;
        jest.clearAllMocks();
    });

    it('returns media category when successful', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            headers: { get: () => 'image/png' },
            blob: jest.fn().mockResolvedValueOnce(new Blob(['dummy'], { type: 'image/png' })),
        });

        const fakeDetect = jest.fn().mockResolvedValue('image');

        const category = await getBlobAndDetectCategory('https://example.com/test.png', undefined, fakeDetect);
        expect(category).toBe('image');
    });


    it('logs error and returns undefined on failure', async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('network error'));

        const result = await getBlobAndDetectCategory('https://example.com/fail.png');
        expect(result).toBeUndefined();
    });
});
