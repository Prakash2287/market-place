import {createTRPCReact} from '@trpc/react-query'
import { AppRouter } from '.';

const trpc=createTRPCReact<AppRouter>({});
export default trpc;