import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Observable, Subscriber, Subscription } from 'rxjs';
import './Example2.scss';
import { InferPropTypes } from '../../@types/infer-prop-types';
import uuid from 'uuid';

const Example2PropTypes = {
  incomingRequiredProp: PropTypes.string.isRequired,
  incomingOptionalProp: PropTypes.string,
};

const Example2DefaultProps = {
  incomingOptionalProp: 'optional prop not given',
};

type Example2PropTypes = InferPropTypes<typeof Example2PropTypes, typeof Example2DefaultProps>;

type FeedItem = { id: string } & ({ type: 'complete' } | { type: 'next'; message: string } | { type: 'error'; error: any });

interface SubscriptionContainer {
  id: string;
  status: 'active' | 'frozen';
  // feed: Feed;
  subscription: Subscription;
}

type Feed = FeedItem[];

const getId = () => uuid.v4();

/**
 * @description
 * Example 2
 *
 * @param props
 */
export const Example2: React.FC<Example2PropTypes> = props => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [subscribers, setSubscribers] = useState<SubscriptionContainer[]>([]);
  const [feeds, setFeeds] = useState<Map<SubscriptionContainer['id'], Feed>>(() => new Map());

  const [observable] = useState(
    (): Observable<string> =>
      Observable.create((producer: Subscriber<string>) => {
        const id = subscriberCount + 1;
        setSubscriberCount(subscriberCount + 1);

        let tick: undefined | number;
        try {
          producer.next(`(${id}) - Welcome!`);
          let counter = 0;
          tick = window.setInterval(() => void producer.next(`(${id}) - (${counter++}) ticking...`), 10000);
        } catch (err) {
          producer.error(err);
        }
        setTimeout(() => {
          tick && window.clearInterval(tick);
          producer.complete();
        }, 30000);
      }),
  );

  /**
   * @description
   * Subscribe to the observable
   */
  function subscribe() {
    const id = getId();

    const feed: Feed = [];

    const completeHandler = () => {
      const nextFeedItem: FeedItem = { id: getId(), type: 'complete' };
      feed.push(nextFeedItem);
      console.log('[complete]', feed);
      setFeeds(new Map(feeds)); // force re-render
    };

    const nextHandler = (value: string) => {
      const nextFeedItem: FeedItem = { id: getId(), type: 'next', message: value };
      feed.push(nextFeedItem);
      console.log('[next]', feed);
      setFeeds(new Map(feeds)); // force re-render
    };

    const errorHandler = (error: any) => {
      const nextFeedItem: FeedItem = { id: getId(), type: 'error', error };
      feed.push(nextFeedItem);
      console.log('[error]', feed);
      setFeeds(new Map(feeds)); // force re-render
    };

    const subscription = observable.subscribe({
      complete: completeHandler,
      error: errorHandler,
      next: nextHandler,
    });

    subscribers.push({ id, status: 'active', subscription });
    setSubscribers([...subscribers]);

    feeds.set(id, feed);
    setFeeds(new Map(feeds));
  }

  /**
   * @description
   * Fired when Subscribe is clicked
   */
  const handleClickSubscribe = () => void subscribe();

  /**
   * @description
   * Fired when Subscribe is clicked
   *
   * @param id
   */
  const handleClickUnsubscribe = (id: string) => {
    const sub = subscribers.find(s => s.id === id);

    if (!sub) return void console.error(`Unable to find subscriber with id "${id}"`);

    sub.subscription.unsubscribe();
    sub.status = 'frozen';

    setSubscribers([...subscribers]);
  };

  console.log('rendering...', { subscribers, feeds });

  return (
    <div className="example-2-container">
      <div>hello</div>
      <div>{props.incomingRequiredProp}</div>
      <button onClick={handleClickSubscribe}>subscribe</button>
      <div className="subscription-list">
        {subscribers.map(sub => {
          const feed = feeds.get(sub.id);
          return (
            <div key={sub.id} className="">
              <div className="subscription-id">{sub.id}</div>
              <div>status: {sub.status}</div>
              <button disabled={sub.status === 'frozen'} onClick={() => handleClickUnsubscribe(sub.id)}>
                unsubscribe
              </button>
              <div>
                {!feed && <div>error: no feed</div>}
                {feed &&
                  feed.map(feedItem => (
                    <div key={feedItem.id}>
                      <div>{feedItem.type}</div>
                      {feedItem.type === 'next' && <div style={{ backgroundColor: 'blue' }}>{feedItem.message}</div>}
                      {feedItem.type === 'complete' && <div style={{ backgroundColor: 'green' }}>-complete-</div>}
                      {feedItem.type === 'error' && <div style={{ backgroundColor: 'red' }}>{String(feedItem.error)}</div>}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Example2.propTypes = Example2PropTypes;
Example2.defaultProps = Example2DefaultProps;
