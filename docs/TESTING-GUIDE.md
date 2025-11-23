# 🧪 Testing Guide - PuntoHack MVP

## 📊 Status Actual

### Coverage Report
```
✅ Total Coverage: 88.37%
✅ 73 tests passing
✅ 0 tests failing

Module Breakdown:
├── modules/users/validations.ts: 100% ✅
├── modules/users/queries.ts:     100% ✅
└── modules/users/actions.ts:     86.15% ⚠️
```

### Tests Distribution
```
tests/modules/users/
├── validations.test.ts  - 35 tests ✅
├── queries.test.ts      - 22 tests ✅
└── actions.test.ts      - 16 tests ✅

Total: 73 tests
```

---

## 🚀 Quick Start

### Comandos Disponibles

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests con UI interactiva
pnpm test:ui

# Ejecutar tests una vez (CI)
pnpm test:run

# Generar reporte de cobertura
pnpm test:coverage

# Watch mode (desarrollo)
pnpm test:watch
```

---

## 🛠️ Stack de Testing

### Dependencias Principales
```json
{
  "vitest": "^4.0.13",
  "@vitest/ui": "^4.0.13",
  "@vitest/coverage-v8": "^4.0.13",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^14.6.1",
  "happy-dom": "^20.0.10"
}
```

### Configuración
- **Test Runner**: Vitest 4.x
- **Environment**: happy-dom (rápido y ligero)
- **Coverage**: v8 (nativo de Node.js)
- **UI**: Vitest UI para debugging interactivo

---

## 📁 Estructura de Testing

### Organización de Archivos
```
tests/
├── setup.ts              # Configuración global de tests
├── test-utils.tsx        # Utilidades y mocks reutilizables
└── modules/
    └── users/
        ├── validations.test.ts  # Tests de Zod schemas
        ├── queries.test.ts      # Tests de repository layer
        └── actions.test.ts      # Tests de server actions
```

### Patrón de Naming
```typescript
// Pattern: [module].[layer].test.ts
users.validations.test.ts  // ✅ Correcto
users.queries.test.ts      // ✅ Correcto
users.actions.test.ts      // ✅ Correcto
```

---

## ✍️ Writing Tests

### Template Básico

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Feature Name", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should do something successfully", async () => {
      // Arrange
      const input = { /* ... */ };
      
      // Act
      const result = await functionUnderTest(input);
      
      // Assert
      expect(result).toEqual(expected);
    });

    it("should handle errors gracefully", async () => {
      // Arrange
      mockFunction.mockRejectedValue(new Error("Test error"));
      
      // Act & Assert
      await expect(functionUnderTest(input)).rejects.toThrow();
    });
  });
});
```

### Mocking Best Practices

#### 1. Mock Supabase Client
```typescript
const mockSupabaseQuery = {
  from: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
  eq: vi.fn(),
};

vi.mock("@/core/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseQuery)),
}));
```

#### 2. Mock Server Actions
```typescript
vi.mock("@/modules/users/queries");

// En el test
vi.mocked(queries.getProfileById).mockResolvedValue(mockProfile);
```

#### 3. Use Test Factories
```typescript
import { createMockProfile, createMockUser } from "../../test-utils";

const testProfile = createMockProfile({ 
  name: "Custom Name",
  role: Role.JUDGE 
});
```

---

## 📋 Coverage Goals

### Current Status
| Category | Current | Goal | Status |
|----------|---------|------|--------|
| Statements | 88.37% | 80%+ | ✅ Pass |
| Branches | 96.15% | 80%+ | ✅ Pass |
| Functions | 77.77% | 80%+ | ⚠️ Close |
| Lines | 88.37% | 80%+ | ✅ Pass |

### Uncovered Areas
```typescript
// modules/users/actions.ts
- Line 134: updateProfileSchema edge case
- Lines 152-156: Error handling path
- Lines 209-213: Role update error path
- Lines 255-259: List filters error path
- Lines 296-300: Delete profile error path
```

**Action Plan**: 
- Agregar tests para error paths específicos
- Target: 90%+ coverage antes de Phase 1

---

## 🎯 Testing Standards

### Must Test
✅ **Happy paths** - Flujos principales exitosos  
✅ **Validation** - Todos los casos de Zod schemas  
✅ **Error handling** - Casos de error esperados  
✅ **Edge cases** - Límites y casos especiales  
✅ **Authorization** - RBAC y permisos  

### Can Skip (For Now)
⏭️ **UI Components** - Diferir hasta Phase 1  
⏭️ **E2E Tests** - Implementar con Playwright después  
⏭️ **Performance Tests** - Solo si hay cuellos de botella  

---

## 🔍 Test Categories

### 1. Validation Tests (35 tests)
```typescript
describe("createProfileSchema", () => {
  it("should accept valid profile data");
  it("should reject missing required fields");
  it("should reject invalid email format");
  it("should reject too many tech stack items");
  // ... etc
});
```

**Coverage**: 100% ✅

### 2. Repository Tests (22 tests)
```typescript
describe("createProfile", () => {
  it("should create a profile successfully");
  it("should throw error on creation failure");
});

describe("getProfileById", () => {
  it("should return profile when found");
  it("should return null when profile not found");
});
```

**Coverage**: 100% ✅

### 3. Server Actions Tests (16 tests)
```typescript
describe("completeOnboarding", () => {
  it("should complete onboarding successfully");
  it("should reject if profile already exists");
  it("should reject invalid form data");
  it("should handle errors gracefully");
});
```

**Coverage**: 86.15% ⚠️

---

## 🚨 Common Issues

### Issue: Mock not working
```typescript
// ❌ Wrong - Importar después de mock
vi.mock("@/module");
import * as module from "@/module";

// ✅ Correct - Importar antes de mock
import * as module from "@/module";
vi.mock("@/module");
```

### Issue: Async assertions failing
```typescript
// ❌ Wrong - Olvidar await
expect(asyncFunction()).resolves.toBe(true);

// ✅ Correct - Usar await
await expect(asyncFunction()).resolves.toBe(true);
```

### Issue: FormData en tests
```typescript
// ✅ Correct way
const formData = new FormData();
formData.append("name", "John");
formData.append("role", Role.PARTICIPANT);
```

---

## 📈 Next Steps

### Corto Plazo (Pre-Phase 1)
- [ ] Aumentar coverage de actions.ts a 90%+
- [ ] Agregar tests para error paths
- [ ] Documentar más casos edge

### Medio Plazo (Durante Phase 1)
- [ ] Tests para módulo hackathons
- [ ] Tests para módulo teams
- [ ] Tests para módulo submissions
- [ ] Setup CI/CD con GitHub Actions

### Largo Plazo (Pre-Production)
- [ ] E2E tests con Playwright
- [ ] Visual regression tests
- [ ] Load testing con k6
- [ ] Security testing

---

## 🎓 Best Practices

### ✅ DO
- Usar describe/it descriptivos
- Mockear dependencies externas
- Limpiar mocks en beforeEach
- Testear casos edge
- Usar factories para test data
- Seguir AAA pattern (Arrange, Act, Assert)

### ❌ DON'T
- Testear implementation details
- Hacer tests dependientes entre sí
- Usar datos hardcodeados
- Olvidar limpiar mocks
- Testear libraries de terceros
- Compartir estado entre tests

---

## 📚 Resources

### Documentation
- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vitest UI](https://vitest.dev/guide/ui.html)

### Internal
- `tests/setup.ts` - Global setup y mocks
- `tests/test-utils.tsx` - Helpers y factories
- `vitest.config.ts` - Configuración de Vitest

---

## 🏆 Success Metrics

### Current Achievement: ⭐⭐⭐⭐ (4/5)

**What we've done right**:
- ✅ 100% validation coverage
- ✅ 100% repository layer coverage
- ✅ 73 passing tests (0 failing)
- ✅ 88%+ overall coverage
- ✅ Fast test execution (~7s)

**What needs improvement**:
- ⚠️ Functions coverage (77% → 80%+)
- ⚠️ Error path coverage en actions
- ⚠️ Component testing (0%)

**Target for Production**: ⭐⭐⭐⭐⭐
- 90%+ coverage
- E2E tests
- CI/CD integration
- Load testing

---

## 🎉 Conclusion

El módulo **users** tiene una base sólida de tests con:
- **73 tests** cubriendo validations, queries, y actions
- **88.37% coverage** superando el objetivo de 80%
- **Arquitectura de testing escalable** lista para replicar en otros módulos

**Next Action**: Replicar este patrón en el módulo hackathons durante Phase 1.

---

**Última actualización**: 23 de Noviembre, 2025  
**Mantenido por**: Diego RM  
**Versión**: 1.0
