import { SocketControllers, SocketControllersOptions } from 'socket-controllers';
import { Server } from 'socket.io';
import { Container } from 'typedi';


export default ( httpServer ) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    new SocketControllers({io, controllers: [__dirname + "/api/controllers/*.ts"], container: Container});

    return io;
};
    
