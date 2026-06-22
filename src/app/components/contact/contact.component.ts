import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  /** Plain-text email fallback shown to visitors who prefer email. */
  readonly contactEmail = 'mohamed.khalil.ucbl@gmail.com';

  private fb = inject(FormBuilder);

  readonly state = signal<SubmitState>('idle');

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  /** Show an error on a field only once it's been touched or the form submitted. */
  showError(controlName: 'name' | 'email' | 'message'): boolean {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty || this.state() === 'error');
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.state.set('error');
      return;
    }

    this.state.set('submitting');

    // ────────────────────────────────────────────────────────────────
    // TODO: WIRE UP REAL SUBMISSION HERE.
    // No email is actually sent yet - this is a stub for you to connect
    // to your own backend or a service like Formspree. Example:
    //
    //   const res = await fetch('https://formspree.io/f/<your-id>', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //     body: JSON.stringify(this.form.value),
    //   });
    //   if (!res.ok) throw new Error('Submit failed');
    //
    // Do NOT commit secrets/API keys to the repo - use environment config.
    // ────────────────────────────────────────────────────────────────

    try {
      // Simulated async so the UI flow is testable without a backend.
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.warn(
        '[contact] Submission stub - no backend connected yet. Payload:',
        this.form.value,
      );
      this.state.set('success');
      this.form.reset();
    } catch {
      this.state.set('error');
    }
  }
}
