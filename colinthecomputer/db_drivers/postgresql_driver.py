from peewee import *
import sqlite3

db = SqliteDatabase('colin.db')

def init_db(host, port):
    db.init('colin')

class BaseModel(Model):
    class Meta:
        database = db

class User(BaseModel):
    user_id = IntegerField()
    username = CharField()
    birthday = DateTimeField()
    gender = FixedCharField() # TODO: Enum?


class Translation(BaseModel):
    x = DoubleField()
    y = DoubleField()
    z = DoubleField()


class Rotation(BaseModel):
    x = DoubleField()
    y = DoubleField()
    z = DoubleField()
    w = DoubleField()


class Pose(BaseModel):
    translation = ForeignKeyField(Translation)
    rotation = ForeignKeyField(Rotation)


class ColorImage(BaseModel):
    path = CharField()


class DepthImage(BaseModel):
    path = CharField()


class Feelings(BaseModel):
    hunger = FloatField()
    thirst = FloatField()
    exhaustion = FloatField()
    happiness = FloatField()


class Snapshot(BaseModel):
    user_id = IntegerField()
    datetime = DateTimeField()
    pose = ForeignKeyField(Pose, null=True, backref='snapshot')
    color_image = ForeignKeyField(ColorImage, null=True, backref='snapshot')
    depth_image = ForeignKeyField(DepthImage, null=True, backref='snapshot')
    feelings = ForeignKeyField(Feelings, null=True, backref='snapshot')


init_db('127.0.0.1', 5432)
db.connect()
db.create_tables([User, Snapshot, Translation, Rotation,
                  Pose, ColorImage, DepthImage, Feelings])

def save_user(user_id, username, birthday, gender):
    user = User(**locals())
    user.save()

def save_pose(user_id, datetime, translation, rotation):
    translation = Translation(**translation)
    rotation = Rotation(**rotation)
    translation.save()
    rotation.save()
    pose = Pose(translation=translation,
                rotation=rotation)
    pose.save()
    snapshot, _ = Snapshot.get_or_create(user_id=user_id, datetime=datetime)
    snapshot.pose = pose
    snapshot.save()

def save_color_image(user_id, datetime, path):
    color_image = ColorImage(path=path)
    color_image.save()
    snapshot, _ = Snapshot.get_or_create(user_id=user_id, datetime=datetime)
    snapshot.color_image = color_image
    snapshot.save()

def save_depth_image(user_id, datetime, path):
    depth_image = DepthImage(path=path)
    depth_image.save()
    snapshot, _ = Snapshot.get_or_create(user_id=user_id, datetime=datetime)
    snapshot.depth_image = depth_image
    snapshot.save()

def save_feelings(user_id, datetime, feelings):
    feelings = Feelings(**feelings)
    feelings.save()
    snapshot, _ = Snapshot.get_or_create(user_id=user_id, datetime=datetime)
    snapshot.feelings = feelings
    snapshot.save()
