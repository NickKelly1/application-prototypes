import React from 'react';
import PropTypes from 'prop-types';
import { Observable, Subscriber, Subscription, fromEvent, Subject } from 'rxjs';
import './Example4.scss';
import { InferPropTypes } from '../../@types/infer-prop-types';
import uuid from 'uuid';

// @see https://cssgridgarden.com/
// @see https://flexboxfroggy.com/
// @see https://css-tricks.com/snippets/css/complete-guide-grid/

const Example4PropTypes = {
  incomingRequiredProp: PropTypes.string.isRequired,
  incomingOptionalProp: PropTypes.string,
};

const Example4DefaultProps = {
  incomingOptionalProp: 'optional prop not given',
};

type Example4PropTypes = InferPropTypes<typeof Example4PropTypes, typeof Example4DefaultProps>;

type TickTockFeedItem = { id: string } & (
  | { type: 'complete' }
  | { type: 'next'; message: string }
  | { type: 'error'; error: any });

interface TickTockSubscriptionContainer {
  id: string;
  status: 'active' | 'frozen';
  // feed: TickTockFeed;
  subscription: Subscription;
}

type TickTockFeed = TickTockFeedItem[];

const getId = () => uuid.v4();

/**
 * @description
 * Example 2
 *
 * @param props
 */
export class Example4 extends React.Component<Example4PropTypes> {
  public static propTypes = Example4PropTypes;
  public static defaultProps = Example4DefaultProps;

  private hotMouseMovementObservable: Observable<any>;
  private mouseMovementObserver?: Subscription;

  private subject: Subject<string>;
  private subjectObserver: Subscription;

  private coldTickTockObservable: Observable<string>;
  private tickTockSubscribers: TickTockSubscriptionContainer[] = [];
  private tickTockFeeds: Map<TickTockSubscriptionContainer['id'], TickTockFeed> = new Map();

  /**
   * @constructor
   *
   * @param props
   */
  public constructor(props: Example4PropTypes) {
    super(props);

    let subscriberCount = 0;

    this.coldTickTockObservable = Observable.create((producer: Subscriber<string>) => {
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

    this.hotMouseMovementObservable = fromEvent(document, 'mousemove');

    this.subject = new Subject();

    this.subject.subscribe(
      data => console.log('data:', data),
      error => console.log('error:', error),
      () => console.log('complete'),
    );

    this.subject.next('the first thing to be sent');
    this.subject.next('second next...');
    this.subjectObserver = this.subject.subscribe(data => console.log('subjectObserver got data:', data));
    this.subject.next('third next...');
    this.subject.next('fourth next...');
    this.subjectObserver.unsubscribe();
    this.subject.next('fifth next...');
    this.subject.next('sixth next...');
  }

  /**
   * @description
   * Is the component subscribed to mouse movement
   */
  private get isSubscribedToMouseMovement() {
    return !!this.mouseMovementObserver;
  }

  /**
   * @description
   * Subscribe to mouse movement
   */
  private subscribeToMouseMovement = () => {
    if (this.isSubscribedToMouseMovement) return;
    this.mouseMovementObserver = this.hotMouseMovementObservable.subscribe(observer => {
      console.log('mouse motion detected...', observer);
    });
    this.setState({});
  };

  /**
   * @description
   * Unsubscribe from mouse movement
   */
  private unsubscribeFromMouseMovement = () => {
    if (this.mouseMovementObserver) {
      this.mouseMovementObserver.unsubscribe();
      this.mouseMovementObserver = undefined;
    }
    this.setState({});
  };

  /**
   * @description
   * Subscribe to the tick tock observer
   */
  private subscribeToTickTock = () => {
    const tickTockFeed: TickTockFeed = [];
    const id = getId();

    this.tickTockFeeds.set(id, tickTockFeed);

    const completeHandler = () => {
      const nextTickTockFeedItem: TickTockFeedItem = { id: getId(), type: 'complete' };
      tickTockFeed.push(nextTickTockFeedItem);
      this.setState({});
    };

    const nextHandler = (value: string) => {
      const nextTickTockFeedItem: TickTockFeedItem = { id: getId(), type: 'next', message: value };
      tickTockFeed.push(nextTickTockFeedItem);
      this.setState({});
    };

    const errorHandler = (error: any) => {
      const nextTickTockFeedItem: TickTockFeedItem = { id: getId(), type: 'error', error };
      tickTockFeed.push(nextTickTockFeedItem);
      this.setState({});
    };

    const subscription = this.coldTickTockObservable.subscribe({
      complete: completeHandler,
      error: errorHandler,
      next: nextHandler,
    });

    this.tickTockSubscribers.push({ id, status: 'active', subscription });
    this.setState({});
  };

  /**
   * @description
   * Unsubscribe from Tick Tock
   */
  private unsubscribeFromTickTock = (id: string) => {
    const sub = this.tickTockSubscribers.find(s => s.id === id);

    if (!sub) return void console.error(`Unable to find subscriber with id "${id}"`);

    sub.subscription.unsubscribe();
    sub.status = 'frozen';
    this.setState({});
  };

  /**
   * @description
   * Fired when Subscribe is clicked
   */
  private handleClickSubscribeTickTock = () => void this.subscribeToTickTock();

  /**
   * @description
   * Fired when Subscribe is clicked
   *
   * @param id
   */
  private handleClickUnsubscribeTickTock = (id: string) => void this.unsubscribeFromTickTock(id);

  /**
   * @description
   * Fired when Subscribe to Mouse Movement is clicked
   */
  private handleClickSubscribeMouseMovement = () => void this.subscribeToMouseMovement();

  /**
   * @description
   * Fired when Unsubscribe to Mouse Movement is clicked
   */
  private handleClickUnsubscribeMouseMovement = () => void this.unsubscribeFromMouseMovement();

  /**
   * @inheritdoc
   */
  public render() {
    const { incomingRequiredProp } = this.props;
    const { tickTockSubscribers, tickTockFeeds } = this;
    console.log('rendering...', { tickTockSubscribers, tickTockFeeds });

    return (
      <div className="example-4-container">
        <div>hello</div>
        {!this.isSubscribedToMouseMovement && (
          <button onClick={this.handleClickSubscribeMouseMovement}>Subscribe to mouse movement</button>
        )}
        {this.isSubscribedToMouseMovement && (
          <button onClick={this.handleClickUnsubscribeMouseMovement}>Unsubscribe from mouse movement</button>
        )}
        <div>{incomingRequiredProp}</div>
        <button onClick={this.handleClickSubscribeTickTock}>subscribe</button>
        <div className="subscription-list">
          {[...tickTockSubscribers].reverse().map(sub => {
            const feed = tickTockFeeds.get(sub.id);
            return (
              <div key={sub.id} className="">
                <div className="subscription-id">{sub.id}</div>
                <div>status: {sub.status}</div>
                <button disabled={sub.status === 'frozen'} onClick={() => this.handleClickUnsubscribeTickTock(sub.id)}>
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
