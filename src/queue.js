import 'dotenv/config';

import Queue from './lib/Queue';

Queue.proccessQueue();

//  esse arquivo foi criado pois a fila nao sera executada no mesmo core da aplicacao e com isso nao afetara a performance da mesma.
