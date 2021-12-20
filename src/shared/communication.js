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
        this.communicator.dispatch({ ...action, __global: true });
    }
}

export const communicationService = new CommunicationService();
