# Quick Start Guide: Using the New Components

## 🚀 5-Minute Integration Guide

This guide shows you how to use the new UX components in your feature pages.

---

## 1. Error Handling (2 minutes)

### Import
```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';
import ErrorDisplay from '../components/shared/ErrorDisplay';
```

### Use
```typescript
const MyFeature = () => {
  const { error, handleError, clearError } = useErrorHandler();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/my-endpoint');
      if (!response.ok) throw response;
      const result = await response.json();
      setData(result);
    } catch (err) {
      handleError(err); // Automatically categorizes error
    }
  };

  return (
    <>
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={fetchData}
          onDismiss={clearError}
        />
      )}
      {/* Your component */}
    </>
  );
};
```

**That's it!** Now all errors show helpful messages with guidance.

---

## 2. Loading Buttons (1 minute)

### Import
```typescript
import LoadingButton from '../components/shared/LoadingButton';
```

### Replace this:
```typescript
<button onClick={handleClick} disabled={loading}>
  {loading ? 'Loading...' : 'Generate'}
</button>
```

### With this:
```typescript
<LoadingButton
  onClick={handleClick}
  loading={loading}
  loadingText="Generating content..."
>
  Generate
</LoadingButton>
```

**Done!** Users now see spinner + custom loading text.

---

## 3. Auto-Save (3 minutes)

### Import
```typescript
import { useAutoSave, useLoadSavedSession } from '../hooks/useAutoSave';
import SessionRecoveryModal from '../components/shared/SessionRecoveryModal';
import AutoSaveIndicator from '../components/shared/AutoSaveIndicator';
```

### Add to your component:
```typescript
const MyFeature = () => {
  const [formData, setFormData] = useState({ topic: '', concepts: '' });
  const [showRecovery, setShowRecovery] = useState(false);
  const [savedSession, setSavedSession] = useState(null);

  // Auto-save hook (saves every 30s)
  const { saveNow } = useAutoSave({
    key: 'my-feature-form',
    data: formData,
  });

  // Load saved session on mount
  const { loadSession, clearSession } = useLoadSavedSession('my-feature-form');

  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSavedSession(saved);
      setShowRecovery(true);
    }
  }, []);

  return (
    <>
      <SessionRecoveryModal
        isOpen={showRecovery}
        savedTimestamp={savedSession?.timestamp || Date.now()}
        featureName="My Feature"
        onRestore={() => {
          setFormData(savedSession.data);
          setShowRecovery(false);
        }}
        onDiscard={() => {
          clearSession();
          setShowRecovery(false);
        }}
        onCancel={() => setShowRecovery(false)}
      />

      <div className="mb-4">
        <AutoSaveIndicator lastSaved={savedSession?.timestamp} />
      </div>

      {/* Your form */}
    </>
  );
};
```

**Done!** Work is never lost, recovery modal shows on return.

---

## 4. Form Tooltips (2 minutes)

### Import
```typescript
import FormTooltip from '../components/shared/FormTooltip';
import { formExamples } from '../data/formExamples';
```

### Replace this:
```typescript
<label>Topic</label>
<input type="text" value={topic} onChange={e => setTopic(e.target.value)} />
```

### With this:
```typescript
<FormTooltip
  label="Topic"
  tooltip="The main subject of your lecture. Be specific for better results."
  example="Introduction to Quantum Mechanics"
  required
>
  <input
    type="text"
    value={topic}
    onChange={e => setTopic(e.target.value)}
    placeholder="e.g., Introduction to..."
  />
</FormTooltip>

<button
  type="button"
  onClick={() => setFormData(formExamples.myFeature)}
  className="text-sm text-brand-gold hover:text-brand-gold-dark"
>
  ✨ Try an example
</button>
```

**Done!** Users see help tooltip and can load example data.

---

## 5. Add Examples to formExamples.ts (5 minutes)

### Open the file:
```
client/src/data/formExamples.ts
```

### Add your feature:
```typescript
export const formExamples = {
  // ... existing features

  myFeature: {
    myForm: {
      topic: 'Example Topic Here',
      concepts: 'Concept 1\nConcept 2\nConcept 3',
      difficulty: 'intermediate' as const,
      // ... all your form fields with realistic values
    },
  },
};
```

**Done!** Users can now load your example data.

---

## 📋 Complete Example

Here's a full feature component with all improvements:

```typescript
import React, { useState, useEffect } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useAutoSave, useLoadSavedSession } from '../hooks/useAutoSave';
import { formExamples } from '../data/formExamples';
import ErrorDisplay from '../components/shared/ErrorDisplay';
import LoadingButton from '../components/shared/LoadingButton';
import FormTooltip from '../components/shared/FormTooltip';
import SessionRecoveryModal from '../components/shared/SessionRecoveryModal';
import AutoSaveIndicator from '../components/shared/AutoSaveIndicator';
import { SparklesIcon } from '@heroicons/react/24/outline';

const MyFeature: React.FC = () => {
  // State
  const [formData, setFormData] = useState({ topic: '', concepts: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [savedSession, setSavedSession] = useState(null);

  // Hooks
  const { error, handleError, clearError } = useErrorHandler();
  const { saveNow } = useAutoSave({ key: 'my-feature', data: formData });
  const { loadSession, clearSession } = useLoadSavedSession('my-feature');

  // Load saved session
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setSavedSession(saved);
      setShowRecovery(true);
    }
  }, []);

  // Generate function
  const handleGenerate = async () => {
    if (!formData.topic) {
      handleError({
        type: 'validation',
        message: 'Please complete required fields',
        suggestion: 'Topic is required to generate content.',
      });
      return;
    }

    setLoading(true);
    clearError();

    try {
      const response = await fetch('/api/my-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw response;

      const data = await response.json();
      setResult(data);
      toast.success('Content generated successfully!');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Recovery Modal */}
      <SessionRecoveryModal
        isOpen={showRecovery}
        savedTimestamp={savedSession?.timestamp || Date.now()}
        featureName="My Feature"
        onRestore={() => {
          setFormData(savedSession.data);
          setShowRecovery(false);
        }}
        onDiscard={() => {
          clearSession();
          setShowRecovery(false);
        }}
        onCancel={() => setShowRecovery(false)}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-semibold text-brand-navy">
          My Feature
        </h1>
        <AutoSaveIndicator lastSaved={savedSession?.timestamp} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <ErrorDisplay
            error={error}
            onRetry={handleGenerate}
            onDismiss={clearError}
          />
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6 mb-6">
        <div className="space-y-6">
          <FormTooltip
            label="Topic"
            tooltip="The main subject of your content. Be specific for better results."
            example="Introduction to Quantum Mechanics"
            required
          >
            <input
              type="text"
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Introduction to..."
              className="w-full px-4 py-2 border border-brand-border rounded-lg"
            />
          </FormTooltip>

          <FormTooltip
            label="Concepts"
            tooltip="List the key concepts to cover, one per line."
            example="Quantum states\nWave functions\nUncertainty principle"
          >
            <textarea
              value={formData.concepts}
              onChange={e => setFormData({ ...formData, concepts: e.target.value })}
              placeholder="One concept per line..."
              rows={5}
              className="w-full px-4 py-2 border border-brand-border rounded-lg"
            />
          </FormTooltip>

          <button
            type="button"
            onClick={() => setFormData(formExamples.myFeature.myForm)}
            className="text-sm text-brand-gold hover:text-brand-gold-dark"
          >
            ✨ Try an example
          </button>
        </div>

        <div className="mt-6">
          <LoadingButton
            onClick={handleGenerate}
            loading={loading}
            loadingText="Generating your content..."
            variant="primary"
            icon={<SparklesIcon className="h-5 w-5" />}
          >
            Generate Content
          </LoadingButton>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-2xl shadow-card border border-brand-border-subtle p-6">
          <h2 className="font-serif text-xl font-semibold text-brand-navy mb-4">
            Generated Content
          </h2>
          {/* Your results display */}
        </div>
      )}
    </div>
  );
};

export default MyFeature;
```

---

## ✅ Checklist

Use this checklist when updating a feature component:

- [ ] Import `useErrorHandler` and `ErrorDisplay`
- [ ] Replace error handling with `handleError()`
- [ ] Replace buttons with `LoadingButton`
- [ ] Import `useAutoSave` and session hooks
- [ ] Add `SessionRecoveryModal` and `AutoSaveIndicator`
- [ ] Replace labels with `FormTooltip`
- [ ] Add examples to `formExamples.ts`
- [ ] Add "Try an example" button
- [ ] Test error handling (disconnect network)
- [ ] Test auto-save (wait 30s, check localStorage)
- [ ] Test recovery modal (refresh page)
- [ ] Test loading states (click generate)
- [ ] Test tooltips (hover question marks)

---

## 🎨 Styling Guidelines

All components follow our brand:

### Colors
```typescript
// Primary
'bg-brand-navy'        // Dark blue
'text-brand-navy'      // Dark blue text
'bg-brand-gold'        // Gold accent
'text-brand-gold'      // Gold text

// Backgrounds
'bg-brand-bg'          // Light gray
'bg-brand-bg-warm'     // Warm gray

// Text
'text-brand-text'      // Body text
'text-brand-text-light' // Lighter text

// Borders
'border-brand-border-subtle'
```

### Spacing
```typescript
'p-6'      // Comfortable padding
'mb-6'     // Section spacing
'space-y-6' // Stack spacing
```

### Borders
```typescript
'rounded-xl'   // Small elements
'rounded-2xl'  // Large cards
```

---

## 📚 Where to Find Examples

All examples are in [`formExamples.ts`](client/src/data/formExamples.ts):

```typescript
import { formExamples } from '../data/formExamples';

// Access examples
formExamples.spacedRepetition.schedule
formExamples.cognitiveLoad.workedExample
formExamples.formativeAssessment.livePoll
// ... etc for all 16 features
```

---

## 🆘 Common Issues

### "Error not showing"
✅ Make sure you're calling `handleError(err)` in catch block
✅ Check that `<ErrorDisplay error={error} />` is rendered

### "Auto-save not working"
✅ Verify unique key for `useAutoSave({ key: 'unique-name', ... })`
✅ Check localStorage in DevTools (Application tab)
✅ Wait 30 seconds after changing form data

### "Recovery modal not appearing"
✅ Ensure you call `loadSession()` in useEffect
✅ Check localStorage for `autosave_your-key`
✅ Make sure modal isn't blocked by another modal

### "Tooltip not showing"
✅ Check z-index if other elements overlap
✅ Try clicking if hover doesn't work
✅ Verify `tooltip` prop is provided

---

## 📞 Need Help?

1. Check [IMPLEMENTATION-COMPLETE.md](IMPLEMENTATION-COMPLETE.md) for detailed docs
2. Look at existing feature components for examples
3. Review [USER-TESTING-REPORT.md](USER-TESTING-REPORT.md) for context
4. Test in browser DevTools (Network tab for errors, Application for localStorage)

---

**Happy coding!** 🎉 These components will dramatically improve user experience.
