import { assert } from 'chai';
import Tracker from './Tracker';

describe('Tracker', () => {
    describe('when disabled', () => {
        it('does not call onComplete', (done) => {
            const tracker = new Tracker('en', false);
            tracker.track('a', 'b', 'c', () => {
                assert.fail('tracking is disabled, should not call callback');
            });

            // not sure how else to do this, but this should theoretically be enough time
            setTimeout(done, 500);
        });
    });

    describe('when enabled', () => {
        it('calls onComplete', (done) => {
            const tracker = new Tracker('en', true);
            tracker.track('a', 'b', 'c', done);
        });
    });
});
