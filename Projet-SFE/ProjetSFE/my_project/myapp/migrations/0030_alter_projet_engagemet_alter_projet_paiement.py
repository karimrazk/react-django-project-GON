# Generated by Django 4.2 on 2023-05-30 11:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0029_alter_user_service'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projet',
            name='engagemet',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='projet',
            name='paiement',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
    ]
