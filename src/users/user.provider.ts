// import { User } from './entities/user.entity';
// // import { REPOSITORY } from "../common/constants";
import {UserRepository} from './user.repository';



export const userProviders = [
  {
    provide: 'USER_REPO',
    useValue: UserRepository,
  },
];
