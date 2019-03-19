import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { useSpring, useTransition, animated } from 'react-spring'
import { isAfter, subSeconds } from 'date-fns';
import { sumBy, orderBy } from 'lodash';

import tweetService from './services/tweetService';
import './App.css';

export default function App({ tweetStream }) {
	const animationConfig = { tension: 125, friction: 20, precision: 0.1 };
	const [refMap] = useState(() => new WeakMap())
	const [tweets, setTweets] = useState([]);
	const [listType, setListType] = useState('latest');

	const barProps = useSpring({
		from: { left: 0 },
		left: listType === 'latest' ? 0 : 1,
		config: animationConfig
	})

	const filters = {
		latest: t => isAfter(new Date(t.timestamp), subSeconds(new Date(), 30)),
		favorite: t => t.liked
	}

	useEffect(() => {
		const serviceSubscription = tweetService.tweets$
		.subscribe(tweets => setTweets(tweets));

		const subscription = tweetStream.subscribe(tweet => tweetService.add(tweet));

	 return () => {
			subscription.unsubscribe();
			serviceSubscription.unsubscribe();
		};
	}, ['tweets']);

 const filteredTweets = orderBy(tweets.filter(filters[listType]), 'timestamp').reverse();
 const likeTweets = sumBy(tweets, t => t.liked ? 1 : 0);

 const transitions = useTransition(filteredTweets, tweet => tweet.id, {
		from: { opacity: 0, height: 0, life: '100%' },
		enter: item => async next => await next({ opacity: 1, height: refMap.get(item).offsetHeight }),
		leave: item => next => next({ opacity: 0, height: 0 }),
		config: animationConfig
	})

	return (
		<div className="App">
			<div className="controls">
				<button className="tab" onClick={() => setListType('latest')}>
					latest
				</button>
				<button className="tab" onClick={() => setListType('favorite')}>
					favorite
					{(likeTweets > 0) && (<span>({likeTweets})</span>)}
				</button>
				<animated.div className="bar" style={{
					left: barProps.left.interpolate({
						range: [0, 1], output: ['0%', '50%']
					})
				}} />
			</div>
			<div className="container">
				{transitions.map(({item, props, key}) => (
					<animated.div key={key} style={props} className="wrapper">
						<div className="content" ref={ref => ref && refMap.set(item, ref)}>
							<div className={classnames("tweet", item.account)}>
								<p className="author">
									{item.account}
								</p>
								<p className="message">
									{item.content}
								</p>
								<button className="like-it" onClick={() => {tweetService.toggle(item.id)}}>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={item.liked ? '#fff' : 'none'} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
								</button>
							</div>
						</div>
					</animated.div>
				))}
				<button className="reset" onClick={() => tweetService.reset()}>
					Clear All Tweets
				</button>
			</div>
		</div>
	);
}
