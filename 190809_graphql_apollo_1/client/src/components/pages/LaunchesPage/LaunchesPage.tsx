import './LaunchesPage.scss';
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { InferPropTypes } from '../../../@types/infer-prop-types';
import Header from '../../Header/Header';
import LaunchTile from '../../LaunchTile/LaunchTile';
import { useUrlState } from '../../../hooks/use-url-state';
import { logger, LOG_COLOURS } from '../../../helpers/logger';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../app/routes';
import LoadingRadarPage from '../LoadingRadarPage/LoadingRadarPage';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const propTypes = {
  //
};
const defaultProps = {
  //
};
type PropTypes = InferPropTypes<typeof propTypes, typeof defaultProps>;

interface LaunchesPageUrlState {
  inp: string;
  that: 'this' | 'that';
  [index: string]: string;
}

const launchesPageUrlDefaults: LaunchesPageUrlState = {
  inp: '',
  that: 'that',
}

const washLaunchesPageUrlState = (dirtyUrlState: Record<string, string>): LaunchesPageUrlState => {
  const inp = dirtyUrlState.inp || launchesPageUrlDefaults.inp;
  const that = dirtyUrlState.that === 'this' ? 'this' : launchesPageUrlDefaults.that;

  const cleanUrlState = {
    inp,
    that,
  }

  logger('washLaunchesPageUrlState', { icon: '🕟', colour: LOG_COLOURS.SPRING_GREEN, message: { dirtyUrlState, cleanUrlState } });

  return cleanUrlState;
};

/**
 * @description
 * Displays the launches
 *
 * @param props
 */
const LaunchesPage: React.FC<PropTypes> = (props) => {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);
  const { urlState, setUrlState } = useUrlState(
    'launchespage',
    washLaunchesPageUrlState,
    launchesPageUrlDefaults,
  );

  if (loading) return <LoadingRadarPage />;
  if (error) return <p>Error</p>;

  logger('LaunchesPage::render', { icon: '🤷', colour: LOG_COLOURS.YELLOW, message: { urlState } });

  return (
    <div className="launches-page">
      <div className="url-state">
        <div className="this-that">
          <span>{'Switch URL between "this" and "that":'}</span>
          <button onClick={() => setUrlState({ that: urlState.that === 'this' ? 'that' : 'this' }, 'PUSH')}>{urlState.that}</button>
        </div>
        <div className="inp">
          <span>{'Put some text to synchronize with the URL:'}</span>
          <input value={urlState.inp} onChange={(e) => setUrlState({ inp: e.currentTarget.value }, 'REPLACE')} />
        </div>
      </div>
      <Header />
      <div className='tiles'>
        {data.launches &&
          data.launches.launches &&
          data.launches.launches.map((launch: any) => <LaunchTile key={launch.id} launch={launch} />)}
      </div>
      <button onClick={() => fetchMore({
        variables: { after: data.launches.cursor, },
        updateQuery: (prev, { fetchMoreResult, ...rest }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...fetchMoreResult,
            launches: {
              ...fetchMoreResult.launches,
              launches: [
                ...prev.launches.launches,
                ...fetchMoreResult.launches.launches,
              ]
            }
          }
        }
      })} >More...</button>
    </div>
  );

}

LaunchesPage.propTypes = propTypes;
LaunchesPage.defaultProps = defaultProps;

export default LaunchesPage;
