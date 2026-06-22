import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type SubmitState = 'idle' | 'success';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  /** Your inbox — also shown as the plain-text fallback. */
  readonly contactEmail = 'mohamed.khalil.ucbl@gmail.com';

  private fb = inject(FormBuilder);

  readonly state = signal<SubmitState>('idle');
  /** True once the visitor has attempted to submit at least once. */
  readonly submitted = signal(false);
  /** Guards against firing the mail handler multiple times. */
  private opening = false;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  /** Show a field error once it's been touched, edited, or a submit was attempted. */
  showError(controlName: 'name' | 'email' | 'message'): boolean {
    const c = this.form.get(controlName);
    return !!c && c.invalid && (c.touched || c.dirty || this.submitted());
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Guard: ignore repeat clicks while the mail app is being opened.
    // (Opening it more than once is what spawned multiple tabs before.)
    if (this.opening) return;
    this.opening = true;

    // ── Open the visitor's email app, pre-filled (no backend, no IDs) ──────
    // Want true in-page sending later (no mail app needed)? Replace this with a
    // POST to Formspree / EmailJS / Web3Forms, e.g.:
    //   await fetch('https://formspree.io/f/<id>', { method: 'POST',
    //     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //     body: JSON.stringify(this.form.getRawValue()) });
    const { name, email, message } = this.form.getRawValue();
    const subject = `New project inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}\n`;
    const mailto =
      `mailto:${this.contactEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    this.state.set('success');

    // Release the guard so they can send another later.
    setTimeout(() => (this.opening = false), 3000);
  }
}
