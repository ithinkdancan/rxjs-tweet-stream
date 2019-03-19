import { v4 } from 'node-uuid';
import {Subject, BehaviorSubject} from 'rxjs';
import { scan, publishReplay, map, refCount } from 'rxjs/operators';

// const { Subject, BehaviorSubject } = window.rxjs;
// const { map, scan, publishReplay } = window.rxjs.operators;

class TweetService {

  constructor() {

    this.update$ = new BehaviorSubject(tweets => tweets);
    this.create$ = new Subject();
    this.reset$ = new Subject();
    this.toggle$ = new Subject();

    this.createTweet$ = new Subject();
    this.resetTweets$ = new Subject();
    this.toggleTweet$ = new Subject();

    this.tweets$ = this.update$
      .pipe(
        scan((tweets, operation) => operation(tweets), []),
        publishReplay(1),
        refCount()
      )

    this.create$
      .pipe(
        map(tweet => tweets => [tweet].concat(tweets))
      )
      .subscribe(this.update$);

    this.toggle$
        .pipe(
          map(uuid => tweets => tweets.map(
            tweet => tweet.id === uuid ?
            { ...tweet, liked: !tweet.liked } :
            tweet
          ))
        )
        .subscribe(this.update$);

    this.reset$
        .pipe(map(() => () => []))
        .subscribe(this.update$);

    this.createTweet$
        .subscribe(this.create$);

    this.toggleTweet$
        .subscribe(this.toggle$);

    this.resetTweets$
        .subscribe(this.reset$);

  }

  add(tweet) {
    this.createTweet$.next({
			id: v4(),
			...tweet,
		});
  }

  reset() {
    this.resetTweets$.next();
  }

  toggle(uuid) {
    this.toggleTweet$.next(uuid);
  }

}

export default new TweetService();
