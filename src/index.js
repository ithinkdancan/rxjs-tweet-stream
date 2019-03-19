import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const { interval, merge } = window.rxjs;
const { map } = window.rxjs.operators;

const createTweetSource = (frequency, account, attribute) => {
  return interval(frequency).pipe(map(i => ({
    account,
    timestamp: Date.now(),
    content: `${attribute} Tweet number ${i + 1}`
  })));
}

const tweets = merge(
  createTweetSource(5000, 'AwardsDarwin', 'Facepalm'),
  createTweetSource(3000, 'iamdevloper', 'Expert'),
  createTweetSource(5000, 'CommitStrip', 'Funny')
);

ReactDOM.render(<App tweetStream={tweets} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

tweets.subscribe(console.log.bind(console));
