-- import Data.list
import System.IO

-- Int
  --  min: -2^63,
  -- max: 2^63

maxInt = maxBound :: Int
minInt = minBound :: Int
bigFloat = 3.99999999999999 + 0.0000000000000005

sumOfNums = sum [1..1000]
addEx = 5 + 4
subEx = 5 - 4
multEx = 5 * 4
divEx = 5 / 4

-- prefix operator
modEx = mod 5 4

-- infix operator
modEx2 = 5 `mod` 4

negNumEx = 5 + (-4)

num9 = 9 :: Int
sqrtOf9 = sqrt (fromintegral num9)
