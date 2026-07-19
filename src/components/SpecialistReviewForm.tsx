import { FormEvent, useMemo, useRef, useState } from "react";
import {
  buildReviewBody,
  buildReviewEmailHref,
  emptyReviewAnswers,
  frequencyOptions,
  painOptions,
  priceOptions,
  ReviewAnswers,
  ReviewOption,
  roleOptions,
} from "../lib/review";

type RequiredField = "role" | "frequency" | "painPoints" | "currentWorkflow" | "price" | "purchaseCondition";
type ReviewErrors = Partial<Record<RequiredField, string>>;

const questionLinks: Record<RequiredField, { href: string; label: string }> = {
  role: { href: "#review-role", label: "Your work" },
  frequency: { href: "#review-frequency", label: "Reporting frequency" },
  painPoints: { href: "#review-pain", label: "Reporting problems" },
  currentWorkflow: { href: "#review-workflow", label: "Current workflow" },
  price: { href: "#review-price", label: "Realistic price" },
  purchaseCondition: { href: "#review-condition", label: "Purchase condition" },
};

function validateReview(answers: ReviewAnswers): ReviewErrors {
  const errors: ReviewErrors = {};
  if (!answers.role) errors.role = "Choose the option that best describes your work.";
  if (!answers.frequency) errors.frequency = "Choose how often you deliver accessibility findings.";
  if (answers.painPoints.length === 0) errors.painPoints = "Choose at least one reporting problem.";
  if (!answers.currentWorkflow.trim()) errors.currentWorkflow = "Describe the tools or process you use now.";
  if (!answers.price) errors.price = "Choose the price that feels realistic.";
  if (!answers.purchaseCondition.trim()) errors.purchaseCondition = "Describe what would make the product worth buying.";
  return errors;
}

function OptionGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: ReviewOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="review-options">
      {options.map((option) => (
        <label key={option.value} data-selected={value === option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            required
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function ReviewPreview({ answers, answeredCount }: { answers: ReviewAnswers; answeredCount: number }) {
  const chosenPains = painOptions
    .filter((option) => answers.painPoints.includes(option.value))
    .map((option) => option.label);
  const optionLabel = (options: ReviewOption[], value: string) =>
    options.find((option) => option.value === value)?.label || "Not answered yet";

  return (
    <aside className="review-preview" aria-label="Live review summary">
      <div className="review-preview-heading">
        <span>Review brief</span>
        <strong>{answeredCount} of 6 answered</strong>
      </div>
      <div className="review-preview-body" aria-live="polite">
        <div data-complete={Boolean(answers.role)}>
          <span>Your work</span>
          <strong>{optionLabel(roleOptions, answers.role)}</strong>
        </div>
        <div data-complete={Boolean(answers.frequency)}>
          <span>Delivery rhythm</span>
          <strong>{optionLabel(frequencyOptions, answers.frequency)}</strong>
        </div>
        <div data-complete={chosenPains.length > 0}>
          <span>Reporting friction</span>
          <strong>{chosenPains.length > 0 ? chosenPains.join(", ") : "Not answered yet"}</strong>
        </div>
        <div data-complete={Boolean(answers.currentWorkflow.trim())}>
          <span>Current workflow</span>
          <strong>{answers.currentWorkflow.trim() || "Not answered yet"}</strong>
        </div>
        <div data-complete={Boolean(answers.price)}>
          <span>Realistic price</span>
          <strong>{optionLabel(priceOptions, answers.price)}</strong>
        </div>
        <div data-complete={Boolean(answers.purchaseCondition.trim())}>
          <span>Purchase threshold</span>
          <strong>{answers.purchaseCondition.trim() || "Not answered yet"}</strong>
        </div>
      </div>
      <p>Nothing is stored or sent from this page.</p>
    </aside>
  );
}

export function SpecialistReviewForm() {
  const [answers, setAnswers] = useState<ReviewAnswers>(emptyReviewAnswers);
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<HTMLDivElement>(null);

  const answeredCount = useMemo(
    () => [
      answers.role,
      answers.frequency,
      answers.painPoints.length > 0 ? "answered" : "",
      answers.currentWorkflow.trim(),
      answers.price,
      answers.purchaseCondition.trim(),
    ].filter(Boolean).length,
    [answers],
  );

  const emailHref = useMemo(() => buildReviewEmailHref(answers), [answers]);

  const updateAnswer = (field: keyof ReviewAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field as RequiredField];
      return next;
    });
  };

  const togglePain = (value: string, checked: boolean) => {
    setAnswers((current) => {
      if (!checked) {
        return { ...current, painPoints: current.painPoints.filter((item) => item !== value) };
      }
      if (value === "no-slowdown") return { ...current, painPoints: [value] };
      return {
        ...current,
        painPoints: [...current.painPoints.filter((item) => item !== "no-slowdown"), value],
      };
    });
    setErrors((current) => {
      const next = { ...current };
      delete next.painPoints;
      return next;
    });
  };

  const prepareReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateReview(answers);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    setErrors({});
    setPrepared(true);
    setCopyStatus("");
    requestAnimationFrame(() => readyRef.current?.focus());
  };

  const copyReview = async () => {
    try {
      await navigator.clipboard.writeText(buildReviewBody(answers));
      setCopyStatus("Review copied. Paste it into any message.");
    } catch {
      setCopyStatus("Copy failed. Open the email app instead.");
    }
  };

  const errorEntries = (Object.entries(errors) as [RequiredField, string | undefined][])
    .filter((entry): entry is [RequiredField, string] => Boolean(entry[1]));

  return (
    <div className="review-workspace">
      <div className="review-form-panel">
        {prepared ? (
          <section className="review-ready" aria-labelledby="review-ready-title" tabIndex={-1} ref={readyRef}>
            <p className="section-label">Review prepared</p>
            <h2 id="review-ready-title">Your answers are ready.</h2>
            <p>Nothing has been sent. You can open your email app, copy the review, or return to your answers.</p>
            <div className="review-ready-actions">
              <a className="button button-primary" href={emailHref}>Open email app</a>
              <button className="button button-secondary" type="button" onClick={copyReview}>Copy review</button>
              <button className="text-button" type="button" onClick={() => setPrepared(false)}>Edit answers</button>
            </div>
            <p className="review-copy-status" role="status" aria-live="polite">{copyStatus}</p>
          </section>
        ) : (
          <form noValidate onSubmit={prepareReview} aria-labelledby="review-form-title">
            <header className="review-form-header">
              <h2 id="review-form-title">Specialist review</h2>
              <p>Answer from your real workflow. Critical answers are more useful than polite ones. All six answers are required.</p>
            </header>

            {errorEntries.length > 0 ? (
              <div className="review-error-summary" role="alert" tabIndex={-1} ref={errorSummaryRef}>
                <strong>Finish these questions</strong>
                <ul>
                  {errorEntries.map(([field, message]) => (
                    <li key={field}><a href={questionLinks[field].href}>{questionLinks[field].label}: {message}</a></li>
                  ))}
                </ul>
              </div>
            ) : null}

            <fieldset
              className="review-question"
              id="review-role"
              tabIndex={-1}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={`review-role-help${errors.role ? " review-role-error" : ""}`}
            >
              <legend>Which option best describes your work?</legend>
              <p className="review-helper" id="review-role-help">Choose the closest match.</p>
              <OptionGroup name="role" options={roleOptions} value={answers.role} onChange={(value) => updateAnswer("role", value)} />
              {errors.role ? <p className="review-field-error" id="review-role-error">Error: {errors.role}</p> : null}
            </fieldset>

            <fieldset
              className="review-question"
              id="review-frequency"
              tabIndex={-1}
              aria-invalid={Boolean(errors.frequency)}
              aria-describedby={`review-frequency-help${errors.frequency ? " review-frequency-error" : ""}`}
            >
              <legend>How often do you deliver accessibility findings?</legend>
              <p className="review-helper" id="review-frequency-help">Count work that ends in findings for a client or internal team.</p>
              <OptionGroup name="frequency" options={frequencyOptions} value={answers.frequency} onChange={(value) => updateAnswer("frequency", value)} />
              {errors.frequency ? <p className="review-field-error" id="review-frequency-error">Error: {errors.frequency}</p> : null}
            </fieldset>

            <fieldset
              className="review-question"
              id="review-pain"
              tabIndex={-1}
              aria-invalid={Boolean(errors.painPoints)}
              aria-describedby={`review-pain-help${errors.painPoints ? " review-pain-error" : ""}`}
            >
              <legend>Where does reporting slow you down?</legend>
              <p className="review-helper" id="review-pain-help">Choose at least one answer. Include every problem that regularly costs you time.</p>
              <div className="review-options">
                {painOptions.map((option) => (
                  <label key={option.value} data-selected={answers.painPoints.includes(option.value)}>
                    <input
                      type="checkbox"
                      name="painPoints"
                      value={option.value}
                      checked={answers.painPoints.includes(option.value)}
                      onChange={(event) => togglePain(option.value, event.target.checked)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.painPoints ? <p className="review-field-error" id="review-pain-error">Error: {errors.painPoints}</p> : null}
            </fieldset>

            <fieldset
              className="review-question"
              id="review-workflow"
              tabIndex={-1}
              aria-invalid={Boolean(errors.currentWorkflow)}
              aria-describedby={`review-workflow-help${errors.currentWorkflow ? " review-workflow-error" : ""}`}
            >
              <legend>What tools or process do you use now?</legend>
              <label className="review-text-field">
                <span>Current reporting workflow</span>
                <textarea
                  value={answers.currentWorkflow}
                  onChange={(event) => updateAnswer("currentWorkflow", event.target.value)}
                  maxLength={500}
                  rows={5}
                  required
                  aria-invalid={Boolean(errors.currentWorkflow)}
                />
              </label>
              <div className="review-field-meta" id="review-workflow-help">
                <span>Name the tools and the handoffs that create work.</span>
                <span>{answers.currentWorkflow.length}/500</span>
              </div>
              {errors.currentWorkflow ? <p className="review-field-error" id="review-workflow-error">Error: {errors.currentWorkflow}</p> : null}
            </fieldset>

            <fieldset
              className="review-question"
              id="review-price"
              tabIndex={-1}
              aria-invalid={Boolean(errors.price)}
              aria-describedby={`review-price-help${errors.price ? " review-price-error" : ""}`}
            >
              <legend>After trying the demo, what price feels realistic?</legend>
              <p className="review-helper" id="review-price-help">Choose what you would personally approve, not what sounds supportive.</p>
              <OptionGroup name="price" options={priceOptions} value={answers.price} onChange={(value) => updateAnswer("price", value)} />
              {errors.price ? <p className="review-field-error" id="review-price-error">Error: {errors.price}</p> : null}
            </fieldset>

            <fieldset
              className="review-question"
              id="review-condition"
              tabIndex={-1}
              aria-invalid={Boolean(errors.purchaseCondition)}
              aria-describedby={`review-condition-help${errors.purchaseCondition ? " review-condition-error" : ""}`}
            >
              <legend>What would have to be true for you to buy it?</legend>
              <label className="review-text-field">
                <span>Purchase condition</span>
                <textarea
                  value={answers.purchaseCondition}
                  onChange={(event) => updateAnswer("purchaseCondition", event.target.value)}
                  maxLength={500}
                  rows={5}
                  required
                  aria-invalid={Boolean(errors.purchaseCondition)}
                />
              </label>
              <div className="review-field-meta" id="review-condition-help">
                <span>Features, trust, proof, integrations, or a different price can all be valid.</span>
                <span>{answers.purchaseCondition.length}/500</span>
              </div>
              {errors.purchaseCondition ? <p className="review-field-error" id="review-condition-error">Error: {errors.purchaseCondition}</p> : null}
            </fieldset>

            <div className="review-submit-row">
              <button className="button button-primary" type="submit">Prepare review email</button>
              <p>Preparing the review does not send it.</p>
            </div>
          </form>
        )}
      </div>

      <ReviewPreview answers={answers} answeredCount={answeredCount} />
    </div>
  );
}
