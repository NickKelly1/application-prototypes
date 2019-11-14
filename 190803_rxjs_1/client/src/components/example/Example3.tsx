import React from 'react';
import PropTypes from 'prop-types';
import { Observable, Subscriber, Subscription } from 'rxjs';
import './Example3.scss';
import { InferPropTypes } from '../../@types/infer-prop-types';
import uuid from 'uuid';

// @see https://cssgridgarden.com/
// @see https://flexboxfroggy.com/
// @see https://css-tricks.com/snippets/css/complete-guide-grid/

const Example3PropTypes = {
  incomingRequiredProp: PropTypes.string.isRequired,
  incomingOptionalProp: PropTypes.string,
};

const Example3DefaultProps = {
  incomingOptionalProp: 'optional prop not given',
};

type Example3PropTypes = InferPropTypes<typeof Example3PropTypes, typeof Example3DefaultProps>;

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
export class Example3 extends React.Component<Example3PropTypes> {
  public static propTypes = Example3PropTypes;
  public static defaultProps = Example3DefaultProps;

  private observable: Observable<string>;
  private subscribers: SubscriptionContainer[] = [];
  private feeds: Map<SubscriptionContainer['id'], Feed> = new Map();

  public constructor(props: Example3PropTypes) {
    super(props);

    let subscriberCount = 0;

    this.observable = Observable.create((producer: Subscriber<string>) => {
      const id = ++subscriberCount;

      let tick: undefined | number;
      try {
        producer.next(`(${id}) - Welcome!`);
        let counter = 0;
        tick = window.setInterval(() => void producer.next(`(${id}) - (${counter++}) ticking...`), 3000);
      } catch (err) {
        producer.error(err);
      }
      setTimeout(() => {
        tick && window.clearInterval(tick);
        producer.complete();
      }, 10000);
    });
  }

  /**
   * @description
   * Subscribe to the observer
   */
  private subscribe = () => {
    const feed: Feed = [];
    const id = getId();

    this.feeds.set(id, feed);

    const completeHandler = () => {
      const nextFeedItem: FeedItem = { id: getId(), type: 'complete' };
      feed.push(nextFeedItem);
      this.setState({});
    };

    const nextHandler = (value: string) => {
      const nextFeedItem: FeedItem = { id: getId(), type: 'next', message: value };
      feed.push(nextFeedItem);
      this.setState({});
    };

    const errorHandler = (error: any) => {
      const nextFeedItem: FeedItem = { id: getId(), type: 'error', error };
      feed.push(nextFeedItem);
      this.setState({});
    };

    const subscription = this.observable.subscribe({
      complete: completeHandler,
      error: errorHandler,
      next: nextHandler,
    });

    this.subscribers.push({ id, status: 'active', subscription });
    this.setState({});
  };

  /**
   * @description
   * Fired when Subscribe is clicked
   */
  private handleClickSubscribe = () => void this.subscribe();

  /**
   * @description
   * Fired when Subscribe is clicked
   *
   * @param id
   */
  private handleClickUnsubscribe = (id: string) => {
    const sub = this.subscribers.find(s => s.id === id);

    if (!sub) return void console.error(`Unable to find subscriber with id "${id}"`);

    sub.subscription.unsubscribe();
    sub.status = 'frozen';
    this.setState({});
  };

  /**
   * @inheritdoc
   */
  public render() {
    const { incomingRequiredProp } = this.props;
    const { subscribers, feeds } = this;
    console.log('rendering...', { subscribers, feeds });

    return (
      <div className="example-3-container">
        <div>hello</div>
        <div>{incomingRequiredProp}</div>
        <button onClick={this.handleClickSubscribe}>subscribe</button>
        <div className="subscription-list">
          {[...subscribers].reverse().map(sub => {
            const feed = feeds.get(sub.id);
            return (
              <div key={sub.id} className="">
                <div className="subscription-id">{sub.id}</div>
                <div>status: {sub.status}</div>
                <button disabled={sub.status === 'frozen'} onClick={() => this.handleClickUnsubscribe(sub.id)}>
                  unsubscribe
                </button>
                <div>
                  {!feed && <div>error: no feed</div>}
                  {feed &&
                    [...feed].reverse().map(feedItem => (
                      <div key={feedItem.id}>
                        <div>{feedItem.type}</div>
                        {feedItem.type === 'next' && <div className="feed-item next">{feedItem.message}</div>}
                        {feedItem.type === 'complete' && <div className="feed-item complete">-complete-</div>}
                        {feedItem.type === 'error' && <div className="feed-item error">{String(feedItem.error)}</div>}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
