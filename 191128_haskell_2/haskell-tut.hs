-- Comments

{-
  Multi-line comment
-}

import Data.List
import System.IO

-- Ints
--  min: -2^63
--  max: 2^63
maxInt = maxBound :: Int
minInt = minBound :: Int
-- Integer -- unbounded whole number (can be as big as memory can hold)
-- Float
-- Double -- precision 11 points
bigFloat1 = 3.9999999999 + 0.0000000005
bigFloat2 = 3.9999999999 + 0.00000000005
-- Bool
-- Char
-- Tuple
sumOfNums = sum[1..1000]
addEx = 5 + 4
subEx = 5 - 4
multEx = 5 * 4
divEx = 5 / 4
-- prefix operator
modEx1 = mod 5 4
-- infix operator
modEx2 = 5 `mod` 4
negNumEx = 5 + (-4)
-- :t sqrt
--    sqrt :: Floating a => a -> a
num9 = 9 :: Int
-- converting from int to floating point
sqrtOf9 = sqrt (fromIntegral num9)
-- built in math functions

pival = pi
ePow9 = exp 9
logOf9 = log 9
squared9 = 9 ** 2
truncateVal = truncate 9.999
roundVal = round 9.999
ceilingVal = ceiling 9.999
floorVal = floor 9.999

-- sin, cos, tan, asin, atan, acos, sinh
-- tanh, cosh, asinh, atanh, acosh
trueAndFalse = True && False
trueOrFalse = True || False
notTrue = not(True)

primeNumbers = [3, 5, 7, 11]
-- concatenate
morePrimes = primeNumbers ++ [13, 17, 19, 23, 29]
-- combine numbers into a list
favNums = 2 : 7 : 21 : 66 : [];
multList = [[3, 5, 7], [11, 13, 17]]
morePrimes2 = 2 : morePrimes
lenPrime = length morePrimes2
revPrime = reverse morePrimes2
isListEmpty = null morePrimes2
-- second element from the list
secondPrime = morePrimes2 !! 1
firstPrime = head morePrimes2
lastPrime = last morePrimes2
first3Primes = take 3 morePrimes2
removedPrimes = drop 3 morePrimes2
maxPrime = maximum morePrimes2
minPrime = minimum morePrimes2

newList = [ 2, 3, 5 ]
prodPrimes = [ 0..10 ]
evenList = [ 2, 4 .. 20 ]
letterList = ['A', 'C' .. 'Z' ]
infinPow10 = [10, 20 .. ]
many2s = take 10 (repeat 2)
cyclelist = take 10 (cycle [1, 2, 3, 4, 5])
listTimes2 = [x * 2 | x <- [1..10]]
listTimes3 = [x * 3 | x <- [1..10], x * 3 <= 50]

divisBy9N13 = [ x | x <- [1..500], x `mod` 13 == 0, x `mod` 9 == 0]
-- sortedList = sort [9, 1, 8, 3, 4, 7]
sumOfLists = zipWith (+) [1, 2, 3, 4, 5] [6, 7, 8, 9, 10]

listBiggerThan5 = filter (>5) morePrimes
evensUpTo20 = takeWhile (<= 20) [2, 4 ..]
multOfListLeft = foldl (*) 1 [2, 3, 4, 5]
multOfListRight = foldr (*) 1 [2, 3, 4, 5]

pow3List = [3^n | n <- [1..10]]
multTable = [[x * y | y <- [1..10]] | x <- [1..10]]

randTuple = (1, "Random Tuple")
bobSmith = ("Bob Smith", 52)
bobsName = fst bobSmith
bobsAge = snd bobSmith
names = ["Bob", "Mary", "Tom"]
addresses = ["123 Main", "234 North", "657 South"]
namesNAdderss = zip names addresses

-- receives integer, receives another integer, returns integer
addMe :: Int -> Int -> Int
-- funcName param1 param2 = operations (returned value)
addMe x y = x + y

sumMe x y = x + y

-- takes int tuple, takes int tuple, returns int tuple
addTuples :: (Int, Int) -> (Int, Int) -> (Int, Int)
addTuples (x, y) (x2, y2) = (x + x2, y + y2)

whatAge :: Int -> String
whatAge 16 = "You can drive"
whatAge 18 = "You can vote"
whatAge 21 = "You're an adult"
whatAge x = "Nothing important"

factorial :: Int -> Int
factorial 0 = 1
factorial n = n * factorial (n - 1)

prodFact n = product[1..n]

isOdd n
  | n `mod` 2 == 0 = False
  | otherwise = True

isEven n = n `mod` 2 == 0


whatGrade :: Int -> String
whatGrade age
  | (age >= 5) && (age <= 6) = "Kindergarten"
  | (age > 6) && (age <= 10) = "Elementary School"
  | (age > 10) && (age <= 14) = "Middle School"
  | (age > 14) && (age <= 18) = "High School"
  | otherwise = "Go to college"

batingAvgRating :: Double -> Double -> String
batingAvgRating hits atBats
  | avg <= 0.2 = "Terrible batting average"
  | avg <= 0.250 = "Average player"
  | avg <= 0.280 = "You're doing pretty good"
  | otherwise = "You're a superstar"
  where avg = hits / atBats


getListItems :: [Int] -> String

getListItems [] = "Your list is empty"
getListItems (x:[]) = "Your list starts with " ++ show x
getListItems (x:y:[]) = "Your list contains " ++ show x ++ " and " ++ show y
getListItems (x:xs) = "The 1st item is " ++ show x ++ " and the rest are " ++ show xs


getFirstItem :: String -> String
getFirstItem [] = "Empty String"
getFirstItem all@(x:xs) = "The first letter in " ++ all ++ " is " ++ show x

times4 :: Int -> Int
times4 x = x * 4
listTimes4 = map times4 [1, 2, 3, 4, 5]

multBy4 :: [Int] -> [Int]
multBy4 [] = []
multBy4 (x:xs) = times4 x : multBy4 xs

-- haskell runtime environment
main = do
  putStrLn "What's your name?"
  name <- getLine
  putStrLn ("Hello " ++ name)

