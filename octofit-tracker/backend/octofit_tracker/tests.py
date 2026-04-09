from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Team, User, Activity, Workout, Leaderboard

class APITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass', team=self.team)
        self.workout = Workout.objects.create(name='Test Workout', description='desc')
        self.leaderboard = Leaderboard.objects.create(team=self.team, points=10)
        self.activity = Activity.objects.create(user=self.user, type='Run', duration=10, distance=1.5)

    def test_api_root(self):
        response = self.client.get(reverse('api-root'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('users', response.data)

    def test_user_list(self):
        response = self.client.get('/users/')
        self.assertEqual(response.status_code, 200)

    def test_team_list(self):
        response = self.client.get('/teams/')
        self.assertEqual(response.status_code, 200)

    def test_activity_list(self):
        response = self.client.get('/activities/')
        self.assertEqual(response.status_code, 200)

    def test_workout_list(self):
        response = self.client.get('/workouts/')
        self.assertEqual(response.status_code, 200)

    def test_leaderboard_list(self):
        response = self.client.get('/leaderboard/')
        self.assertEqual(response.status_code, 200)
