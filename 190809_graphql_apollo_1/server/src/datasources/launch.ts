/* eslint-disable @typescript-eslint/camelcase */
import { RESTDataSource } from 'apollo-datasource-rest';

export class LaunchAPI extends RESTDataSource {
  public constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2';
  }

  private launchReducer = (launch: any) => ({
    id: launch.flight_number || 0,
    cursor: `${launch.launch_date_unix}`,
    site: launch.launch_site && launch.launch_site.site_name,
    mission: {
      name: launch.mission_name,
      missionPatchSmall: launch.links.mission_patch_small,
      missionPatchLarge: launch.links.mission_patch,
    },
    rocket: {
      id: launch.rocket.rocket_id,
      name: launch.rocket.rocket_name,
      type: launch.rocket.rocket_type,
    },
  });

  public getAllLaunches = async () => {
    const res = await this.get('launches');
    return res instanceof Array ? res.map(launch => this.launchReducer(launch)) : [];
  };

  public getLaunchById = async ({ launchId }: { launchId: number }) => {
    const res = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(res[0]);
  };

  public getLaunchesByIds = ({ launchIds }: { launchIds: number[] }) => {
    return Promise.all(launchIds.map(launchId => this.getLaunchById({ launchId })));
  };
}
