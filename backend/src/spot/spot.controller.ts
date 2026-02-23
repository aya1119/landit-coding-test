import { Controller, Get, Query } from '@nestjs/common';
import { SpotService } from './spot.service';

@Controller('spots')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Get()
  async findNearby(
    @Query('lat') latStr: string,
    @Query('lng') lngStr: string,
    @Query('radiusKm') radiusKmStr: string,
  ) {
    const lat = Number(latStr);
    const lng = Number(lngStr);
    const radiusKm = Number(radiusKmStr ?? '5');

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { error: 'lat and lng are required numbers' };
    }
    if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
      return { error: 'radiusKm must be a positive number' };
    }

    const spots = await this.spotService.findNearby(lat, lng, radiusKm);
    return { count: spots.length, spots };
  }
}

