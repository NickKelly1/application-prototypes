# echo "building & running 'back-end'..."
# cd ../packages/back-end
# yarn
# yarn build
# yarn start

TAG="@nick-kelly_ts_composite_5__back-end"

# path
cd ../packages/back-end

# build
docker build \
  --tag $TAG \
  -f Dockerfile \
  .

# begin

