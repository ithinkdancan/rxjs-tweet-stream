
import tweetService from '../tweetService';

describe('Tweet Service', () => {

	afterEach(() => {
		tweetService.reset()
	})

	it('creates a new tweet', (done) => {

		tweetService.add({
			account: 'tester'
		})

		tweetService.tweets$.subscribe((tweets) => {
			expect(tweets).toEqual([expect.objectContaining({ account: 'tester' })]);
			done()
		});
	});

	it('toggles the like state', (done) => {
		tweetService.add({
			id: 'testId',
			account: 'tester'
		});

		tweetService.toggle('testId')

		tweetService.tweets$.subscribe((tweets) => {
			console.log('tweets', { tweets})
			expect(tweets).toEqual([expect.objectContaining({ account: 'tester', liked: true })]);
			done()
		});
	});

	it('resets all tweets', () => {

	});

});
