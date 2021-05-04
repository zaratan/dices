import { parseCommand } from '../../helpers/cmd';

describe('parseCommand', () => {
  it('returns all the fields', () => {
    const result = parseCommand('1');
    expect(result.ambi).not.toBe(undefined);
    expect(result.dices).not.toBe(undefined);
    expect(result.raw).not.toBe(undefined);
    expect(result.remove1).not.toBe(undefined);
    expect(result.reroll10).not.toBe(undefined);
    expect(result.sr).not.toBe(undefined);
  });

  describe('sr', () => {
    it('defaults to 6', () => {
      expect(parseCommand('1').sr).toEqual(6);
    });

    it('parses sr8', () => {
      expect(parseCommand('1 sr8').sr).toEqual(8);
      expect(parseCommand('1s sr8').sr).toEqual(8);
      expect(parseCommand('1+3 sr8').sr).toEqual(8);
      expect(parseCommand('sr8 1').sr).toEqual(8);
      expect(parseCommand('sr8 1e').sr).toEqual(8);
      expect(parseCommand('sr8 1+3').sr).toEqual(8);
    });

    it('parses sr with spaces', () => {
      expect(parseCommand('1 sr 8').sr).toEqual(8);
      expect(parseCommand('sr 8 1').sr).toEqual(8);
      expect(parseCommand('1+2 sr 8').sr).toEqual(8);
      expect(parseCommand('sr 8 2 + 3').sr).toEqual(8);
    });

    it('parses sr higher than 9', () => {
      expect(parseCommand('1 sr18').sr).toEqual(18);
      expect(parseCommand('1 sr 18').sr).toEqual(18);
      expect(parseCommand('sr18 1').sr).toEqual(18);
      expect(parseCommand('sr 18 1').sr).toEqual(18);
      expect(parseCommand('1+2 sr 18').sr).toEqual(18);
      expect(parseCommand('sr 18 2 + 3').sr).toEqual(18);
    });

    it("doesn't accepts s as a shortcut", () => {
      expect(parseCommand('1 s18').sr).toEqual(6);
      expect(parseCommand('1 s 18').sr).toEqual(6);
      expect(parseCommand('s 8 1').sr).toEqual(6);
    });

    it('takes the first sr found', () => {
      expect(parseCommand('1 sr5 sr8').sr).toEqual(5);
    });
  });

  describe('raw', () => {
    it('looks for raw', () => {
      expect(parseCommand('1+2 raw').raw).toBeTruthy();
      expect(parseCommand('2 raw').raw).toBeTruthy();
      expect(parseCommand('raw sr4 2').raw).toBeTruthy();
    });

    it('works for full number', () => {
      expect(parseCommand('12r').raw).toBeTruthy();
      expect(parseCommand('12  r').raw).toBeTruthy();
      expect(parseCommand('12 sr 4 r').raw).toBeFalsy();
      expect(parseCommand('12 sr 4 raw').raw).toBeTruthy();
    });

    it('works for the attr+abi numbers', () => {
      expect(parseCommand('1+2r').raw).toBeTruthy();
      expect(parseCommand('1+2  r').raw).toBeTruthy();
      expect(parseCommand('1+2 sr 4 r').raw).toBeFalsy();
      expect(parseCommand('1+2 sr 4 raw').raw).toBeTruthy();
    });

    it('works for sums', () => {
      expect(parseCommand('1+2+3r').raw).toBeTruthy();
      expect(parseCommand('1+2+3    r').raw).toBeTruthy();
      expect(parseCommand('1+2+3  sr 4  r').raw).toBeFalsy();
      expect(parseCommand('1+2+3  sr 4  raw').raw).toBeTruthy();
    });
  });

  describe('dice count', () => {
    describe('full number', () => {
      it('parses full number correctly', () => {
        expect(parseCommand('18').dices).toEqual(18);
      });

      // sr 8 6
      it('works with sr', () => {
        expect(parseCommand('sr 8 6').dices).toEqual(6);
      });

      // 2+5 spec
      // 2+5 spe
      // 2+5 sp
      it('supports spec rightly placed', () => {
        expect(parseCommand('7 spec 2').dices).toEqual(7);
        expect(parseCommand('7 spec 2').remove1).toEqual(2);
        expect(parseCommand('7 spe 2').remove1).toEqual(2);
        expect(parseCommand('7 sp 2').remove1).toEqual(2);
      });

      // spec 2+5
      // spe 2+5
      // sp 2+5
      it('supports spec lefty placed', () => {
        expect(parseCommand('spec 2 7').dices).toEqual(7);
        expect(parseCommand('spec 2 7').remove1).toEqual(2);
        expect(parseCommand('spe 2 7').remove1).toEqual(2);
        expect(parseCommand('sp 2 7').remove1).toEqual(2);
      });

      // spec sr 4 2+5
      // 2+5 sr 4 spec
      it('supports garbage between spec', () => {
        expect(parseCommand('spec2 sr 4 7').dices).toEqual(7);
        expect(parseCommand('sp 2 sr5 7').remove1).toEqual(2);
        expect(parseCommand('7 sr 3 sp 2').remove1).toEqual(2);
      });

      describe('modifiers', () => {
        // 18e
        it('supports explosive numbers', () => {
          expect(parseCommand('18e').dices).toEqual(18);
          expect(parseCommand('18e').reroll10).toBeTruthy();
        });

        // 18 e
        it('supports spaces between explosive and number', () => {
          expect(parseCommand('18 e').dices).toEqual(18);
          expect(parseCommand('18 e').reroll10).toBeTruthy();
          expect(parseCommand('2 e').reroll10).toBeFalsy();
        });

        // 18r
        it('supports raw numbers', () => {
          expect(parseCommand('18r').dices).toEqual(18);
          expect(parseCommand('18r').raw).toBeTruthy();
        });

        // 18 r
        it('supports spaces between raw and number', () => {
          expect(parseCommand('18 r').dices).toEqual(18);
          expect(parseCommand('18 r').raw).toBeTruthy();
        });

        // 18s2
        it('supports speciality numbers', () => {
          expect(parseCommand('18s2').dices).toEqual(18);
          expect(parseCommand('18s2').remove1).toEqual(2);
          expect(parseCommand('3s2').remove1).toEqual(0);
        });

        // 18 s 2
        it('supports space between speciality and numbers', () => {
          expect(parseCommand('18 s 2').dices).toEqual(18);
          expect(parseCommand('18 s 2').remove1).toEqual(2);
          expect(parseCommand('18 s 2 sr 2').remove1).toEqual(2);
          expect(parseCommand('sr 2 18 s 2').remove1).toEqual(2);
        });

        // 18 sr2 r
        it('does not work with something between the modifier and the numbers', () => {
          expect(parseCommand('18 sr2 r').dices).toEqual(18);
          expect(parseCommand('18 sr2 r').raw).toBeFalsy();
          expect(parseCommand('18 sr2 e').reroll10).toBeFalsy();
          expect(parseCommand('18 sr2 s3').remove1).toEqual(0);
        });
      });
    });

    describe('attr+abi number', () => {
      // 2+2
      it('supports normal sum', () => {
        expect(parseCommand('2+2').dices).toEqual(4);
        expect(parseCommand('2+2').reroll10).toBeFalsy();
        expect(parseCommand('2+2').raw).toBeFalsy();
        expect(parseCommand('2+2').remove1).toEqual(0);
      });

      // 2 + 2
      it('supports spaces in sum', () => {
        expect(parseCommand('2   +   2').dices).toEqual(4);
        expect(parseCommand('2 +2').dices).toEqual(4);
        expect(parseCommand('2+ 2').dices).toEqual(4);
      });

      // 2+3
      it('calculates explosions', () => {
        expect(parseCommand('2+3').dices).toEqual(5);
        expect(parseCommand('2+2').reroll10).toBeFalsy();
        expect(parseCommand('2+3').reroll10).toBeTruthy();
        expect(parseCommand('2+8').reroll10).toBeTruthy();
      });

      // 1+0
      // 0+3
      it('supports 0s', () => {
        expect(parseCommand('3+0').dices).toEqual(3);
        expect(parseCommand('0+3').dices).toEqual(3);
      });

      // 2+5
      it('does not remove 1s by default', () => {
        expect(parseCommand('2+5').remove1).toEqual(0);
      });

      // 10+10
      it('supports 10s', () => {
        expect(parseCommand('3+10').dices).toEqual(13);
        expect(parseCommand('10+3').dices).toEqual(13);
        expect(parseCommand('10 +   10').dices).toEqual(20);
      });

      // 2+5 spec
      // 2+5 spe
      // 2+5 sp
      it('supports spec rightly placed', () => {
        expect(parseCommand('2+5 spec').dices).toEqual(7);
        expect(parseCommand('2+5 spec').remove1).toEqual(2);
        expect(parseCommand('2+5 spe').remove1).toEqual(2);
        expect(parseCommand('2+5 sp').remove1).toEqual(2);
      });

      // spec 2+5
      // spe 2+5
      // sp 2+5
      it('supports spec lefty placed', () => {
        expect(parseCommand('spec 2+5').dices).toEqual(7);
        expect(parseCommand('spec 2+5').remove1).toEqual(2);
        expect(parseCommand('spe 2+5').remove1).toEqual(2);
        expect(parseCommand('sp 2+5').remove1).toEqual(2);
      });

      // spec sr 4 2+5
      // 2+5 sr 4 spec
      it('supports garbage between spec', () => {
        expect(parseCommand('spec sr 4 2+5').dices).toEqual(7);
        expect(parseCommand('spec sr5 2+5').remove1).toEqual(2);
        expect(parseCommand('2+5 sr 3 sp').remove1).toEqual(2);
      });
    });

    describe('sum number', () => {
      // 1+2+3;
      it('supports sums', () => {
        expect(parseCommand('1+2+3').dices).toEqual(6);
      });

      // 1  +2   +3;
      it('supports spaces', () => {
        expect(parseCommand('1   +2   +3').dices).toEqual(6);
        expect(parseCommand('1+    2+    3').dices).toEqual(6);
        expect(
          parseCommand('        1   +        2   +      3    ').dices
        ).toEqual(6);
      });

      // hsdkjsd 1  +   2   +   3   LOL;
      it('supports garbage', () => {
        expect(parseCommand(' sdkjsd 1  +   2   +   3   LOL;').dices).toEqual(
          6
        );
      });

      // 1+2+3+4+5+6;
      it('supports longer sums', () => {
        expect(parseCommand('1+2+3+4+5+6').dices).toEqual(21);
      });

      // 1+2+3   r;
      it('detects the raw modifier', () => {
        expect(parseCommand('1+2+3   r').dices).toEqual(6);
        expect(parseCommand('1+2+3   r').raw).toBeTruthy();
      });

      // 1+2+3   e;
      it('detects the explosive modifier', () => {
        expect(parseCommand('1+2+3   e').dices).toEqual(6);
        expect(parseCommand('1+2+3   e').reroll10).toBeTruthy();
      });

      // 1+2+3   s   5;
      it('detects the speciality modifier', () => {
        expect(parseCommand('1+2+3    s    5').dices).toEqual(6);
        expect(parseCommand('1+2+3    s    5').remove1).toEqual(5);
        expect(parseCommand('1+1+1    s    5').remove1).toEqual(0);
      });

      // 1+2+3 sr4  spec   5;
      // 1+2+3 sr4  spe   5;
      // 1+2+3 sr4  sp   5;
      it('supports rightly spec', () => {
        expect(parseCommand('1+2+3 sr4  spec   5').dices).toEqual(6);
        expect(parseCommand('1+2+3 sr4  spe   5').dices).toEqual(6);
        expect(parseCommand('1+2+3 sr4  sp   5').dices).toEqual(6);
        expect(parseCommand('1+2+3 sr4  spec   5').remove1).toEqual(5);
        expect(parseCommand('1+2+3 sr4  spe   5').remove1).toEqual(5);
        expect(parseCommand('1+2+3 sr4  sp   5').remove1).toEqual(5);
        expect(parseCommand('1+2+3 spec   5').remove1).toEqual(5);
        expect(parseCommand('1+2+3  spe   5').remove1).toEqual(5);
        expect(parseCommand('1+2+3   sp   5').remove1).toEqual(5);
      });

      // sp   5   sr 6 1+2+3;
      // spe   5   sr 6 1+2+3;
      // spec   5   sr 6 1+2+3;
      it('supports lefty spec', () => {
        expect(parseCommand('spec5 sr 4 1+2+3').dices).toEqual(6);
        expect(parseCommand('spe 5 sr4 1+2+3').dices).toEqual(6);
        expect(parseCommand('sp 5 sr4 1+2+3').dices).toEqual(6);
        expect(parseCommand('spec5 sr 4 1+2+3').remove1).toEqual(5);
        expect(parseCommand('spe 5 sr4 1+2+3').remove1).toEqual(5);
        expect(parseCommand('sp 5 sr4 1+2+3').remove1).toEqual(5);
        expect(parseCommand('spec5 1+2+3').remove1).toEqual(5);
        expect(parseCommand('spe 5 1+2+3').remove1).toEqual(5);
        expect(parseCommand('sp 5 1+2+3').remove1).toEqual(5);
      });
    });
  });
});
