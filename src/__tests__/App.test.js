import React from 'react';
import { shallow } from 'enzyme';
import { tweets$ } from '../services/tweetService';
import App from '../App';

jest.mock('../services/tweetService');

describe('App', () => {

	it('subscribes to rxjs', () => {
		const props = {
			tweetStream: {
				subscribe: jest.fn()
			}
		};

		const component = shallow(
			<App {...props} />
		);

		expect(props.tweetStream.subscribe).toHaveBeenCalledTimes(1)
		expect(tweets$.subscribe).toHaveBeenCalledTimes(1)
	});

	it('adds new tweets from the tweet stream', () => {

	});

	it('can like a tweet', () => {

	});

	it('can switch to favorite tweets and back', () => {

	});

	it('can clear the list of tweets', () => {

	});
});
