#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /
COPY ["hello-app/hello-app.csproj", "hello-app/"]
RUN dotnet restore "hello-app/hello-app.csproj"
COPY . .
WORKDIR "/hello-app"
RUN dotnet build "hello-app.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "hello-app.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "hello-app.dll"]
