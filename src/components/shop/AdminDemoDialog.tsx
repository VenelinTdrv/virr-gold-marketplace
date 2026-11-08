import { useEffect, useRef, useState } from 'react';
import { Save, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type DemoField, type DemoRecord, validateRecord } from '@/lib/shop/admin-demo';

type Props = { title: string; fields?: DemoField[]; record?: DemoRecord | undefined; rows?: DemoRecord[]; confirm?: string; onSave?: (values: string[]) => void; onConfirm?: () => void; onClose: () => void };
export function AdminDemoDialog({ title, fields = [], record, rows = [], confirm, onSave, onConfirm, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState(() => fields.map((f, i) => record?.values[i] ?? (f.type === 'select' ? f.options?.[0] ?? '' : '')));
  const [error, setError] = useState('');
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="erp-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="erp-dialog-heading"><h2>{title}</h2><Button variant="ghost" size="icon" aria-label="Затвори прозореца" title="Затвори" onClick={onClose}><X /></Button></div>
    {confirm ? <><p>{confirm}</p><div className="erp-dialog-actions"><Button variant="outline" onClick={onClose}>Отказ</Button><Button className="erp-danger" onClick={onConfirm}><Trash2 />Потвърди</Button></div></> : <form onSubmit={e => { e.preventDefault(); const problem = validateRecord(fields, values, rows, record?.key); setError(problem ?? ''); if (!problem) onSave?.(values); }}>
      <div className="erp-form-grid">{fields.map((field, index) => <label key={field.label}>{field.label}{!field.optional && <span aria-hidden="true"> *</span>}{field.type === 'select' ? <select aria-label={field.label} required value={values[index]} onChange={e => setValues(v => v.map((x, i) => i === index ? e.target.value : x))}>{field.options?.map(option => <option key={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea aria-label={field.label} value={values[index]} maxLength={4000} onChange={e => setValues(v => v.map((x, i) => i === index ? e.target.value : x))} /> : <input aria-label={field.label} required={!field.optional} type={field.type === 'number' ? 'number' : 'text'} step="any" min={field.min} maxLength={4000} value={values[index]} onChange={e => setValues(v => v.map((x, i) => i === index ? e.target.value : x))} />}</label>)}</div>
      {error && <p role="alert" className="erp-unavailable">{error}</p>}<div className="erp-dialog-actions"><Button type="button" variant="outline" onClick={onClose}>Отказ</Button><Button type="submit"><Save />Запази</Button></div>
    </form>}
  </dialog>;
}