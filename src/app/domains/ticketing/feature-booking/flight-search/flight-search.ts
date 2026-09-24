import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
// import { LuggageClient } from '../../../luggage/data/luggage-client';

import { httpResource } from '@angular/common/http';
import { FlightClient } from '../../data/flight-client';
import { FlightCard } from '../../ui/flight-card/flight-card';
import { FlightStore } from './flight-store';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, FlightCard, JsonPipe, RouterLink],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  private readonly flightClient = inject(FlightClient);
  private readonly store = inject(FlightStore);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly filter = linkedSignal(() => ({
    from: this.store.from(),
    to: this.store.to(),
  }));

  protected readonly filterForm = form(this.filter);

  protected readonly flights = this.store.flightsWithDelays;

  protected readonly rawFlights = this.store.flightsValue;
  protected readonly isLoading = this.store.flightsIsLoading;
  protected readonly error = this.store.flightsError;

  protected readonly basket = this.store.basket;

  protected readonly flightRoute = computed(
    () => this.filter().from + ' - ' + this.filter().to,
  );

  private readonly count = signal(0);
  private readonly shouldLog = signal(false);
  private readonly isEven = computed(() => {
    console.log('OBSERVED');
    return this.count() % 2;
  });

  private flightsResource = httpResource(
    () =>
      `https://demo.angulararchitects.io/api/flight?from=${this.filter().from}&to=${this.filter().to}`,
  );

  /*private flightsResource = rxResource({
    params: this.filter,
    stream: ({ params }) => this.flightClient.find(params.from, params.to),
  });*/

  /*private flightsResource = resource({
    params: this.filter,
    loader: ({ params }) =>
      firstValueFrom(this.flightClient.find(params.from, params.to)),
  });*/

  constructor() {
    effect(() => {
      const error = this.error();
      if (error || this.filter().to === 'error') {
        const message = 'Error loading flights: ' + error;
        this.snackBar.open(message, 'OK');
      }
    });

    this.count.set(1);
    this.count.set(2);
    this.count.set(3);
    effect(() => {
      //this.isEven();
      //if (this.shouldLog()) {
      console.log('COUNT:', this.count());
      //}
    });

    effect(() => {
      console.log('RESOURCE', this.flightsResource.value());
    });
  }

  protected search(): void {
    this.store.updateFilter(this.filter().from, this.filter().to);
    this.store.reload();
  }

  protected updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }

  protected delay(): void {
    this.store.delay();
  }
}
