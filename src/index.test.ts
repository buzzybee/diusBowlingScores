import {BowlingGame} from "./index";

describe('Ten pin bowling scoresheet', () => {
    let bowlingGame: BowlingGame = new BowlingGame();

    beforeEach(() => {
        bowlingGame = new BowlingGame();
    });

    test('should get a score from one frame when not a strike or spare', () => {
        bowlingGame.roll(4);
        bowlingGame.roll(2);
        expect(bowlingGame.score()).toBe(6);
    });

    test('should throw error when rolling more than remaining pins', () => {
        bowlingGame.roll(5);
        try {
            bowlingGame.roll(8);
        } catch (err) {
            expect(err.message).toBe('Roll exceeds the remaining pins');
        }
    });

    test('should get a score from two frames when first frame was a spare', () => {
        // first frame is a spare
        bowlingGame.roll(4);
        bowlingGame.roll(6);

        // score is  (10 + 5) + (5 + 2)
        bowlingGame.roll(5);
        bowlingGame.roll(2);

        expect(bowlingGame.score()).toBe(22);
    });

    test('should get a score from two frames when first frame had a strike', () => {
        // first frame is a strike
        bowlingGame.roll(10);

        // score is  (10 + 3 + 5) + (3 + 5)
        bowlingGame.roll(3);
        bowlingGame.roll(5);

        expect(bowlingGame.score()).toBe(26);
    });

    test('should allow zero for rolls', () => {
        // first frame is a spare
        bowlingGame.roll(0);
        bowlingGame.roll(6);

        bowlingGame.roll(0);
        bowlingGame.roll(0);

        expect(bowlingGame.score()).toBe(6);
    });

    test('should allow extra roll when on last frame and roll is a spare', () => {
        bowlingGame.roll(1);
        bowlingGame.roll(0);
        bowlingGame.roll(2);
        bowlingGame.roll(0);
        bowlingGame.roll(3);
        bowlingGame.roll(0);
        bowlingGame.roll(4);
        bowlingGame.roll(0);
        bowlingGame.roll(5);
        bowlingGame.roll(0);
        bowlingGame.roll(6);
        bowlingGame.roll(0);
        bowlingGame.roll(7);
        bowlingGame.roll(0);
        bowlingGame.roll(8);
        bowlingGame.roll(0);
        bowlingGame.roll(9);
        bowlingGame.roll(0);

        // spare
        bowlingGame.roll(5);
        bowlingGame.roll(5);

        // extra rolls
        bowlingGame.roll(5);
        expect(bowlingGame.score()).toBe(60);
    });

    test('should allow extra two rolls when on last frame and roll is a strike', () => {
        bowlingGame.roll(1);
        bowlingGame.roll(0);

        bowlingGame.roll(2);
        bowlingGame.roll(0);

        bowlingGame.roll(3);
        bowlingGame.roll(0);

        bowlingGame.roll(4);
        bowlingGame.roll(0);

        bowlingGame.roll(5);
        bowlingGame.roll(0);

        bowlingGame.roll(6);
        bowlingGame.roll(0);

        bowlingGame.roll(7);
        bowlingGame.roll(0);

        bowlingGame.roll(8);
        bowlingGame.roll(0);

        bowlingGame.roll(9);
        bowlingGame.roll(0);

        // strike
        bowlingGame.roll(10);

        // extra 2 rolls
        bowlingGame.roll(5);
        bowlingGame.roll(4);
        expect(bowlingGame.score()).toBe(64);

    });

    test('should have a score of 300 when all strikes are rolled', () => {
        for (let i = 0; i < 10; i++) {
            bowlingGame.roll(10);
        }
        // extra 2 rolls
        bowlingGame.roll(10);
        bowlingGame.roll(10);
        expect(bowlingGame.score()).toBe(300);

    });

    test.each([[-1, 11]])('should not allow rolls outside of bounds',
        (roll) => {
            try {
                bowlingGame.roll(roll);
            } catch (err) {
                expect(err.message).toBe('Roll must be between zero and 10');
            }
        });

    test('should not allow more than 10 frames', () => {
        try {
            for (let i = 0; i < 12; i++) {
                bowlingGame.roll(1);
                bowlingGame.roll(0);
            }
        } catch (err) {
            expect(err.message).toBe('Match is over');
        }
    });

    test('should reply with a pending score when frame is spare or strike', () => {
        // first frame is a spare
        bowlingGame.roll(4);
        bowlingGame.roll(6);
        try {
            expect(bowlingGame.score()).toBe(22);
        } catch (err) {
            expect(err).toBe('Score pending');
        }
    });
});
