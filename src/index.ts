import * as assert from 'assert';

interface IBowlingGame {
    roll(noOfPins: number): void;
    score(): number;
}

interface IFrame {
    rolls: Array<number>;
    firstRollScore(): number;
    frameScore(): number;
    isSpare(): boolean;
    isStrike(): boolean;
    setRoll(noOfPins: number): boolean;
    remainingPins(): number;
}

class Frame implements IFrame {

    private MAX_NUMBER_OF_PINS = 10;
    rolls: Array<number> = [];

    // return true if this is end of this frame
    setRoll(noOfPins: number): boolean {
        this.rolls.push(noOfPins);

        // if this is a strike then we advance the frame
        if (noOfPins === this.MAX_NUMBER_OF_PINS) {
            return true;
        }
        return (this.rolls.length === 2);
    }

    remainingPins(): number {
        const pinCount = this.rolls.reduce((a, b) => a + b, 0);
        return this.MAX_NUMBER_OF_PINS - pinCount;
    }

    firstRollScore(): number {
        return this.rolls[0];
    }

    frameScore(): number {
        return this.rolls.reduce((a, b) => a + b, 0);
    }

    isStrike(): boolean {
        return this.rolls.length === 1 && this.rolls[0] === this.MAX_NUMBER_OF_PINS;
    }

    isSpare(): boolean {
        return this.rolls.length === 2 && (this.frameScore() === this.MAX_NUMBER_OF_PINS);
    }
}

export class BowlingGame implements IBowlingGame {

    private frames: IFrame[] = [];
    private MAX_NUMBER_OF_FRAMES = 10;
    private STRIKE = 10;
    private currentFrameIndex = 0;

    roll(noOfPins: number): void {
        assert(noOfPins >= 0 && noOfPins <= this.STRIKE,
            'Roll must be between zero and 10');
        const frame = this.getCurrentFrame(this.currentFrameIndex);
        if (this.isFinalFrame(this.currentFrameIndex)) {
            assert(this.finalFrameRollCheck(), 'Match is over');
            frame.setRoll(noOfPins);
        } else {
            this.addToRoll(noOfPins, frame);
        }
    }

    score(): number {
        let score = 0;
        this.frames.forEach((frame, index) => {
            if (frame.isSpare()) {
                score = score + frame.frameScore() + this.getNextRollsScore(index);
            } else if (frame.isStrike()) {
                score = score + frame.frameScore() + this.getNextTwoRollsScore(index);
            } else {
                score = score + frame.frameScore();
            }
        });
        return score;
    }

    private addToRoll(noOfPins: number, frame: IFrame) {
        assert(noOfPins <= frame.remainingPins(), 'Roll exceeds the remaining pins');
        const incrementFrame = frame.setRoll(noOfPins);
        if (incrementFrame) {
            this.currentFrameIndex++;
        }
    }

    private isFinalFrame(frameNumber: number): boolean {
        return frameNumber === this.MAX_NUMBER_OF_FRAMES - 1;
    }

    private finalFrameRollCheck(): boolean {
        const finalFrame = this.frames[this.MAX_NUMBER_OF_FRAMES - 1];
        if (finalFrame.rolls.length < 2) {
            return true;
        }
        if (finalFrame.rolls[0] === this.STRIKE || finalFrame.isSpare()) {
            return true;
        }
        return false;
    }

    private getNextRollsScore(index: number): number {
        if (index + 1 >= this.frames.length) {
            throw 'Score pending';
        }
        return this.frames[index + 1].firstRollScore();
    }

    private getNextTwoRollsScore(index: number): number {
        if (this.isFinalFrame(index)) {
            return this.getCurrentFrame(index).frameScore();
        }
        const firstRoll = this.getNextFrame(index).firstRollScore();
        if (firstRoll === this.STRIKE) {
            const secondRoll = this.getNextFrame(index + 1).firstRollScore();
            return firstRoll + secondRoll;
        } else {
            return this.frames[index + 1].frameScore();
        }
    }

    private getCurrentFrame(frameIndex: number) {
        if (frameIndex >= this.frames.length) {
            this.frames.push(new Frame());
        }
        return this.frames[frameIndex];
    }

    private getNextFrame(index: number) {
        if (this.isFinalFrame(index)) {
            return this.frames[index];
        }
        return this.frames[index + 1];
    }
}