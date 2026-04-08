from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from octofit_tracker import models as octo_models

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete existing data
        self.stdout.write(self.style.WARNING('Deleting existing data...'))
        get_user_model().objects.all().delete()
        octo_models.Team.objects.all().delete()
        octo_models.Activity.objects.all().delete()
        octo_models.Leaderboard.objects.all().delete()
        octo_models.Workout.objects.all().delete()

        # Create Teams
        marvel = octo_models.Team.objects.create(name='Team Marvel')
        dc = octo_models.Team.objects.create(name='Team DC')

        # Create Users (Superheroes)
        User = get_user_model()
        ironman = User.objects.create_user(username='ironman', email='ironman@marvel.com', password='password', team=marvel)
        captain = User.objects.create_user(username='captainamerica', email='captain@marvel.com', password='password', team=marvel)
        batman = User.objects.create_user(username='batman', email='batman@dc.com', password='password', team=dc)
        superman = User.objects.create_user(username='superman', email='superman@dc.com', password='password', team=dc)

        # Create Activities
        octo_models.Activity.objects.create(user=ironman, type='Run', duration=30, distance=5)
        octo_models.Activity.objects.create(user=batman, type='Swim', duration=45, distance=2)
        octo_models.Activity.objects.create(user=superman, type='Cycle', duration=60, distance=20)
        octo_models.Activity.objects.create(user=captain, type='Walk', duration=20, distance=2)

        # Create Workouts
        octo_models.Workout.objects.create(name='Morning Cardio', description='Cardio workout for all')
        octo_models.Workout.objects.create(name='Strength Training', description='Strength workout for superheroes')

        # Create Leaderboard
        octo_models.Leaderboard.objects.create(team=marvel, points=100)
        octo_models.Leaderboard.objects.create(team=dc, points=90)

        self.stdout.write(self.style.SUCCESS('Database populated with test data!'))
