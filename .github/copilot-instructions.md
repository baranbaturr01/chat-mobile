# Chat App - Mobile (React Native)

## Proje Açıklaması
Müslüman topluluklar için gerçek zamanlı mesajlaşma uygulamasının iOS ve Android mobil istemcisi.

## Teknoloji Stack
- React Native 0.76+ (bare workflow)
- TypeScript
- React Navigation 7.x (navigation)
- Zustand (state management)
- React Query / TanStack Query (server state)
- Socket.io-client veya native WebSocket (gerçek zamanlı mesajlaşma)
- AsyncStorage (local storage)
- React Native Paper veya NativeBase (UI components)
- React Native Vector Icons
- Axios (HTTP client)
- React Hook Form + Yup (form validation)
- React Native Push Notifications

## Mimari Kurallar
- Feature-based folder structure kullan
- Her feature kendi screens/, components/, hooks/, services/ klasörlerini içersin
- Custom hooks ile business logic'i UI'dan ayır
- TypeScript strict mode aktif olsun
- Tüm API çağrıları services/ klasöründe merkezi olsun
- Axios interceptor ile JWT token yönetimi (auto-refresh)

## UI/UX Kuralları
- Tema: Yeşil tonları (#2E7D32 primary, #1B5E20 dark)
- Dark mode desteği olsun
- RTL (Right-to-Left) desteği olsun (Arapça için)
- Responsive tasarım (tablet uyumlu)
- Skeleton loading kullan
- Pull-to-refresh pattern

## Güvenlik
- JWT token'ları AsyncStorage yerine react-native-keychain ile sakla
- SSL pinning uygula (production)
- Biometric authentication desteği (opsiyonel)

## Performans
- FlatList ile lazy loading
- Image caching (react-native-fast-image)
- Memo ve useCallback optimizasyonları
- Bundle size minimize