dotnet restore
dotnet clean
dotnet build -c Release
dotnet pack SoundInTheory.Piranha.MediaExtensions.Images.csproj --no-build -c Release -o ./.nuget