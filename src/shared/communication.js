import { Communicator, setupPostQuecast } from '@wikia/post-quecast';

class CommunicationService {
    /**
     * @private
     */
    communicator;

    constructor() {
        setupPostQuecast();
        this.communicator = new Communicator();
    }

    dispatch(action) {
        this.communicator.dispatch({...action, __global: true});
    }

    on(action, callback) {
        this.communicator.addListener((a) => {
            if (this.ofType(a, action)) {
                callback(a);
            }
        });
    }

    ofType(action, actionToListen) {
        return action.type === actionToListen;
    }
}

export const communicationService = new CommunicationService();
