set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  npm test

  # build
  VERSION=$VERSION npm run build

  # version
  npm version $VERSION --message "[release] $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push origin master
  npm publish
fi
