## Code Update Summary

All files have been updated with:
1. `.js` extensions for all local imports (not for library/package imports)
2. `@/` alias used consistently for imports 
3. `process` imported from 'process' in files using environment variables

Files checked and updated:
- All controller files 
- All service files
- All route files
- App.ts and database configuration
- Environment variables checked in:
  - application.service.ts
  - email.service.ts
  - forgot-password.service.ts
  - database.ts
  
No environment variables found in:
- timetable.service.ts
- section.service.ts
- class.service.ts
- subject.service.ts

`tsconfig.json` has been updated to include:
```json
{
    "moduleResolution": "node",
    "allowJs": true,
    "resolveJsonModule": true
}
```