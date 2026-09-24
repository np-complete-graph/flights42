import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

// import { LuggageClient } from '../../../luggage/data/luggage-client';
import { Flight } from '../../data/flight';
import { FlightClient } from '../../data/flight-client';
import { FlightCard } from '../../ui/flight-card/flight-card';

@Component({
  selector: 'app-flight-search',
  imports: [FormField, FlightCard, JsonPipe, RouterLink],
  templateUrl: './flight-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {
  private flightClient = inject(FlightClient);

  protected from = signal('Graz');
  protected to = signal('Hamburg');

  //TODO: Implement a Resource that fetches the flights from/to using flightClient

  protected readonly delayInMin = signal(0);

  //TODO: Create a computed signal that returns the label for the current search filter from -> to
  protected readonly flightRoute = computed(() => '??');

  //TODO: implement the search functionality using the from/to signals. How can this be done?
  //Task 1: Can you find a solution that reactively fetches the flights? Can you avoid doing multiple requests when typing, if so how?
  //Task 2: Can you find a solution to only make the query, when the user presses "search"?

  protected readonly flightsWithDelay = computed(() =>
    toFlightsWithDelays(this.flights(), this.delayInMin()),
  );
}

function toFlightsWithDelays(flights: Flight[], delay: number): Flight[] {
  if (flights.length === 0) {
    return [];
  }

  const ONE_MINUTE = 1000 * 60;
  const oldFlights = flights;
  const oldFlight = oldFlights[0];
  const oldDate = new Date(oldFlight.date);
  const newDate = new Date(oldDate.getTime() + delay * ONE_MINUTE);
  const newFlight = { ...oldFlight, date: newDate.toISOString() };

  return [newFlight, ...flights.slice(1)];
}
