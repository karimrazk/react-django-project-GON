# Generated by Django 4.2 on 2023-05-11 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0019_partenaire_participation_partenaire_projets'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participation',
            name='contribution',
            field=models.DecimalField(decimal_places=2, max_digits=19),
        ),
        migrations.AlterField(
            model_name='programme',
            name='cout_global',
            field=models.DecimalField(decimal_places=2, max_digits=19),
        ),
        migrations.AlterField(
            model_name='projet',
            name='budget_global',
            field=models.DecimalField(decimal_places=2, max_digits=19),
        ),
        migrations.AlterField(
            model_name='projet',
            name='paiement',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=19),
        ),
    ]
